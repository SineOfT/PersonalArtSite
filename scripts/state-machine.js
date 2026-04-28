import { lerp } from "/scripts/util.js";

const ENTER_STATE_EVENT = 'ENTER';

export default class StateMachine {
    constructor(name, initialState, globalGoalStates, stateTransitions, statefulObj, update) {
        this.name = name;
        this.state = initialState;
        this.globalGoalStates = globalGoalStates;
        this.stateTransitions = stateTransitions;
        this.statefulObj = statefulObj;
        this.update = update;

        this.framesQueue = [];             // frames to be displayed until finish state
        this.pendingGoalStates = [];       // goal states to be transitioned after delay
        this.pendingEventGoalState = null; // goal state to be transitioned once goal state free
        this.goalState = null;             // goal state to be transitioned to
        this.event = null;                 // event when new state entered
    }

    tick(events) {
        const frame = this.tickFrame(events);
        this.update(frame);
    }

    tickFrame(events) {
        this.event = null; // reset event
        
        // count down the number of frames before a pending goal state, if exists
        for (const pendingGoalState of this.pendingGoalStates) {
            pendingGoalState.remainingFrames--;
        }

        // find any pending event goal states based on events this frame
        if (Array.isArray(this.stateTransitions[this.state].eventGoalStates)) {
            for (const eventGoalState of this.stateTransitions[this.state].eventGoalStates) {
                const event = events.find(({ event }) => event == eventGoalState.event);
                if (event != null && eventGoalState.predicate(this.statefulObj, event.data) && eventGoalState.prob >= Math.random()) {
                    this.pendingEventGoalState = eventGoalState.state;
                    break;
                }
            }
        }

        // if still frames to show, show next frame
        if (this.framesQueue.length > 0) {
            return this.getNextFrame();
        }

        // local and global goal states take precedence over current goal state, so see if any predicates match
        let newGoalState = null;

        // if any local goal states to transition to, set goal state to state
        if (Array.isArray(this.stateTransitions[this.state].goalStates)) {
            for (const { state, predicate } of this.stateTransitions[this.state].goalStates) {
                if (predicate(this.statefulObj)) {
                    newGoalState = state;
                    break;
                }
            }
        }

        // if still no new goal state and any global goal states to transition to, set goal state to state
        if (newGoalState == null) {
            for (const { state, predicate } of this.globalGoalStates) {
                if (predicate(this.statefulObj)) {
                    newGoalState = state;
                    break;
                }
            }
        }

        // set new goal state if found
        if (newGoalState != null) {
            this.goalState = newGoalState;
        }

        // if no current goal state and pending goal state reaches end, set to goal state
        if (this.goalState == null) {
            for (let i = 0; i < this.pendingGoalStates.length; i++) {
                if (this.pendingGoalStates[i].remainingFrames <= 0) {
                    this.goalState = this.pendingGoalStates[i].state;
                    this.pendingGoalStates.splice(i);
                    break;
                }
            }
        }

        // if no current goal state and pending event goal state exists, set to goal state
        if (this.goalState == null && this.pendingEventGoalState != null) {
            this.goalState = this.pendingEventGoalState;
            this.pendingEventGoalState = null;
        }

        // if goal state is set and not there yet, find the next transition to get closer to the state
        if (this.goalState != null) {
            const nextState = this.stateTransitions[this.state].goalStateIntermediaries?.[this.goalState];
            if (nextState != null) {
                return this.beginTransition(nextState); // if is intermediary state, transition to state
            } else {
                const goalState = this.goalState;
                this.goalState = null;
                this.event = { event: `${ENTER_STATE_EVENT} ${this.name}.${goalState}` };
                return this.beginTransition(goalState); // if no intermediary state, transition to goal state
            }
        }

        // if no pending goal state, determine random goal state
        if (Array.isArray(this.stateTransitions[this.state].randomGoalStates)) {
            for (let i = 0; i < this.stateTransitions[this.state].randomGoalStates.length; i++) {
                if (this.pendingGoalStates[i] == null) {
                    const randomGoalStates = this.stateTransitions[this.state].randomGoalStates[i]
                        .filter(({ state }) => state != this.state);
                    const weightTotal = randomGoalStates.reduce((acc, { weight }) => acc + weight, 0);
                    let randomWeight = Math.random() * weightTotal;
                    for (const { state, weight, minDelay, maxDelay } of randomGoalStates) {
                        if (randomWeight < weight) {
                            this.pendingGoalStates[i] = {
                                state,
                                remainingFrames: Math.floor(lerp(minDelay, maxDelay+1, randomWeight / weight)),
                            };
                            break;
                        }
                        randomWeight -= weight;
                    }
                }
            }
        }

        // if still no transitions found, rerun current state's frames
        const frames = this.stateTransitions[this.state].frames;
        this.framesQueue.push(...frames);
        return this.getNextFrame();
    }
    
    /// gets the next frame in the frames queue, invoking any actions that are associated to it
    /// assumes the queue is nonempty
    getNextFrame() {
        const frameObj = this.framesQueue.shift();

        // if the frame is just a frame, return it
        if (typeof frameObj === 'number') {
            this.statefulObj.params = null; // reset params if not passed
            return frameObj;
        }

        // if the frame has an associated action, invoke the action then return the frame
        const { frame, action, params } = frameObj;
        action?.(this.statefulObj);
        this.statefulObj.params = params;
        return frame;
    }

    /// begins a transition from the state machine's current state, returning the next frame to show
    beginTransition(state) {
        // if is transition to different state, enqueue exit and enter transition frames
        if (this.state !== state) {
            const exitTransitionFrames = this.stateTransitions[this.state].transitionFrames?.[state];
            if (Array.isArray(exitTransitionFrames)) {
                this.framesQueue.push(...exitTransitionFrames);
            }
        }
        // add new state's frames to queue
        const frames = this.stateTransitions[state].frames;
        this.framesQueue.push(...frames);

        // clear pending goal states unless transition should maintain
        if (!this.stateTransitions[this.state].maintainPendingGoalStates?.[state]) {
            this.pendingGoalStates = [];
            this.pendingEventGoalState = null;
        }

        this.state = state;

        return this.getNextFrame();
    }
}

export function getBackgroundSize(spritesheetWidth, spritesheetHeight) {
    return `${spritesheetWidth * 100}% ${spritesheetHeight * 100}%`;
}

export function getBackgroundPosition(spritesheetWidth, spritesheetHeight, index) {
    const x = spritesheetWidth  === 1 ? 0 :           (index % spritesheetWidth) / (spritesheetWidth -1);
    const y = spritesheetHeight === 1 ? 0 : Math.floor(index / spritesheetWidth) / (spritesheetHeight-1);
    return `${x * 100}% ${y * 100}%`;
}