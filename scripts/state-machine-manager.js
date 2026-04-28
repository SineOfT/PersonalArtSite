const FPS = 10;
const FRAME_DURATION_MS = 1000/FPS;

const MOUSE_EVENT = 'MOUSE';

export default function initStateMachineManager(stateMachines) {
    let mouseEventData;
    
    let previousFrameTimestamp = 0;
    function update(timestamp) {
        // only update once this frame has been shown for its duration
        if (previousFrameTimestamp + FRAME_DURATION_MS < timestamp) {
            // if skipped multiple frame timestamps, set previous to most recent timestamp
            previousFrameTimestamp += FRAME_DURATION_MS * Math.floor((timestamp - previousFrameTimestamp) / FRAME_DURATION_MS);
            
            // get events from state machines, add mouse event if present
            const stateMachineEvents = stateMachines.map(stateMachine => stateMachine.event);
            if (mouseEventData != null) {
                stateMachineEvents.push({ event: MOUSE_EVENT, data: mouseEventData });
            }

            // tick state machines
            for (let i = 0; i < stateMachines.length; i++) {
                const events = stateMachineEvents.filter((event, j) => i !== j && event != null);
                stateMachines[i].tick(events);
            }

            mouseEventData = null;
        }
        window.requestAnimationFrame(update);
    }

    window.addEventListener('mousemove', function(e) {
        mouseEventData ??= { speed: [0, 0] };
        mouseEventData.position = [e.clientX, e.clientY];
        mouseEventData.speed[0] += Math.abs(e.movementX);
        mouseEventData.speed[1] += Math.abs(e.movementY);
    });

    window.requestAnimationFrame(update);
}