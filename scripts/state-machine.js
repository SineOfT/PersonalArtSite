import { lerp } from "/scripts/util.js";

export default class StateMachine {
    constructor(initialState, globalGoalStates, stateTransitions, statefulObj) {
        this.state = initialState;
        this.globalGoalStates = globalGoalStates;
        this.stateTransitions = stateTransitions;
        this.statefulObj = statefulObj;

        this.framesQueue = [];       // frames to be displayed until finish state
        this.pendingGoalStates = []; // goal states to be transitioned after delay
        this.goalState = null;       // goal state to be transitioned to
    }

    tick() {
        // count down the number of frames before a pending goal state, if exists
        for (const pendingGoalState of this.pendingGoalStates) {
            pendingGoalState.remainingFrames--;
        }

        // if still frames to show, show next frame
        if (this.framesQueue.length > 0) {
            return this.getNextFrame();
        }

        // local and global goal states take precedence over current goal state, so see if any predicates match
        let newGoalState = null;

        // if any local goal states to transition to, set goal state to state
        if (Array.isArray(this.stateTransitions[this.state].goalStates)) {
            for (const { state, predicate, maintainPendingGoalStates } of this.stateTransitions[this.state].goalStates) {
                if (predicate(this.statefulObj)) {
                    newGoalState = state;
                    if (!maintainPendingGoalStates) {
                        this.pendingGoalStates = [];
                    }
                    break;
                }
            }
        }

        // if still no new goal state and any global goal states to transition to, set goal state to state
        if (newGoalState == null) {
            for (const { state, predicate } of this.globalGoalStates) {
                if (predicate(this.statefulObj)) {
                    this.goalState = state;
                    this.pendingGoalStates = [];
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
                }
            }
        }

        // if goal state is set and not there yet, find the next transition to get closer to the state
        if (this.goalState != null) {
            const nextState = this.stateTransitions[this.state].goalStateIntermediaries?.[this.goalState];
            if (nextState != null) {
                return this.beginTransition(nextState); // if is intermediary state, transition to state
            } else {
                const goalState = this.goalState;
                this.goalState = null;
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

        console.log(JSON.stringify(this.pendingGoalStates));

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

        const frames = this.stateTransitions[state].frames;
        this.framesQueue.push(...frames);

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