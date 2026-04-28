import StateMachine, { getBackgroundSize, getBackgroundPosition } from "/scripts/state-machine.js";
import {
    getPositionOnSprite,
    isWithinDistance, isWithinProjectionX, isWithinProjectionY
} from "/scripts/util.js";

const BODY_SPRITESHEET_WIDTH = 10;
const BODY_SPRITESHEET_HEIGHT = 6;
const BODY_SPRITE_WIDTH = 128;
const BODY_SPRITE_HEIGHT = 128;

const HEAD_SPRITESHEET_WIDTH = 3;
const HEAD_SPRITESHEET_HEIGHT = 2;
const HEAD_SPRITE_WIDTH  = BODY_SPRITE_WIDTH  * 3/8;
const HEAD_SPRITE_HEIGHT = BODY_SPRITE_HEIGHT * 3/8;

const EAR_SPRITESHEET_WIDTH = 6;
const EAR_SPRITESHEET_HEIGHT = 4;
const EAR_SPRITE_WIDTH  = BODY_SPRITE_WIDTH  / 4;
const EAR_SPRITE_HEIGHT = BODY_SPRITE_HEIGHT / 4;

const EYE_SPRITESHEET_WIDTH = 5;
const EYE_SPRITESHEET_HEIGHT = 4;
const EYE_SPRITE_WIDTH  = BODY_SPRITE_WIDTH  / 16;
const EYE_SPRITE_HEIGHT = BODY_SPRITE_HEIGHT / 16;

const TAIL_SPRITESHEET_WIDTH = 4;
const TAIL_SPRITESHEET_HEIGHT = 3;
const TAIL_SPRITE_WIDTH  = BODY_SPRITE_WIDTH  / 8;
const TAIL_SPRITE_HEIGHT = BODY_SPRITE_HEIGHT / 8;

const SHIKA_NAME = 'SHIKA';

const IDLE = 'IDLE';
const BACK = 'BACK';
const SIDE = 'SIDE';
const UP = 'UP';
const TURN = 'TURN';
const JUMP = 'JUMP';
const HOP  = 'HOP';
const WALK = 'WALK';
const SIT = 'SIT';
const SIT_BACK = 'SIT_BACK';
const SIT_SIDE = 'SIT_SIDE';
const SIT_UP = 'SIT_UP';
const EAT = 'EAT';
const FRONT_BLINK = 'FRONT_BLINK';
const BACK_BLINK = 'BACK_BLINK';
const SIDE_BLINK = 'SIDE_BLINK';
const UP_BLINK = 'UP_BLINK';
const SIT_BLINK = 'SIT_BLINK';
const SIT_BACK_BLINK = 'SIT_BACK_BLINK';
const SIT_SIDE_BLINK = 'SIT_SIDE_BLINK';
const SIT_UP_BLINK = 'SIT_UP_BLINK';
const EAT_BLINK = 'EAT_BLINK';
const FRONT_TAIL_FLICK = 'FRONT_TAIL_FLICK';
const BACK_TAIL_FLICK = 'BACK_TAIL_FLICK';
const SIDE_TAIL_FLICK = 'SIDE_TAIL_FLICK';
const UP_TAIL_FLICK = 'UP_TAIL_FLICK';
const EAT_TAIL_FLICK = 'EAT_TAIL_FLICK';

const BODY_STAND_INDEX = 0;
const BODY_TURN_INDEX = 1;
const BODY_JUMP_INDEX = 10;
const BODY_HOP_INDEX = 18;
const BODY_WALK_ENTER_INDEX = 23;
const BODY_WALK_INDEX = 25;
const BODY_WALK_EXIT_INDEX = 33;
const BODY_SIT_ENTER_INDEX = 37;
const BODY_SIT_INDEX = 43;
const BODY_SIT_EXIT_INDEX = 44;
const BODY_EAT_ENTER_INDEX = 50;
const BODY_EAT_INDEX = 53;
const BODY_EAT_EXIT_INDEX = 54;

const HEAD_FRONT_INDEX = 0;
const HEAD_BACK_INDEX = 1;
const HEAD_SIDE_INDEX = 2;
const HEAD_UP_INDEX = 3;
const HEAD_FRONT_BACK_INDEX = 4;
const HEAD_BACK_FRONT_INDEX = 5;

const EAR_FRONT_INDEX = 0;
const EAR_BACK_INDEX = 1;
const EAR_SIDE_INDEX = 2;
const EAR_UP_INDEX = 3;
const EAR_FRONT_BACK_INDEX = 4;
const EAR_BACK_FRONT_INDEX = 5;
const EAR_FRONT_SIDE_INDEX = 6;
const EAR_SIDE_BACK_INDEX = 7;
const EAR_BACK_SIDE_INDEX = 8;
const EAR_SIDE_FRONT_INDEX = 9;
const EAR_FRONT_UP_INDEX = 10;
const EAR_UP_FRONT_INDEX = 11;
const EAR_SIT_ENTER_INDEX = 12;
const EAR_SIT_EXIT_INDEX = 16;
const EAR_EAT_ENTER_INDEX = 17;
const EAR_EAT_INDEX = 20;
const EAR_EAT_EXIT_INDEX = 21;

const EYE_FRONT_INDEX = 0;
const EYE_FRONT_BLINK_INDEX = 1;
const EYE_BACK_INDEX = 4;
const EYE_BACK_BLINK_INDEX = 5;
const EYE_LEFT_SIDE_INDEX = 8;
const EYE_LEFT_SIDE_BLINK_INDEX = 9;
const EYE_UP_INDEX = 12;
const EYE_UP_BLINK_INDEX = 13;
const EYE_EAT_INDEX = 16;
const EYE_EAT_BLINK_INDEX = 17;

const TAIL_INDEX = 0;
const TAIL_FLICK_INDEX = 1;
const TAIL_SIT_ENTER_INDEX = 7;

const HEAD_STAND_POS = ['41%', '20%'];
const HEAD_SIT_POS = ['42%', '4%'];

const EAR_STAND_FRONT_POS = ['49%', '41%'];
const EAR_STAND_BACK_POS  = ['46%', '41%'];
const EAR_STAND_SIDE_POS  = ['49%', '41%'];
const EAR_STAND_UP_POS    = ['45%', '36%'];
const EAR_SIT_FRONT_POS = ['50%', '25%'];
const EAR_SIT_BACK_POS  = ['47%', '25%'];
const EAR_SIT_SIDE_POS  = ['50%', '25%'];
const EAR_SIT_UP_POS    = ['46%', '20%'];
const EAR_EAT_POS = ['62%', '10%'];

const EYE_RIGHT_STAND_FRONT_POS = ['63%', '41%'];
const EYE_LEFT_STAND_BACK_POS   = ['53%', '41%'];
const EYE_LEFT_STAND_SIDE_POS   = ['62.5%', '41.5%'];
const EYE_RIGHT_STAND_SIDE_POS  = ['55%', '41.7%'];
const EYE_RIGHT_STAND_UP_POS    = ['58.5%', '44.5%'];
const EYE_RIGHT_SIT_FRONT_POS = ['64%', '25%'];
const EYE_LEFT_SIT_BACK_POS   = ['54%', '25%'];
const EYE_LEFT_SIT_SIDE_POS   = ['63.5%', '25.5%'];
const EYE_RIGHT_SIT_SIDE_POS  = ['56%', '25.7%'];
const EYE_RIGHT_SIT_UP_POS    = ['59.5%', '28.5%'];
const EYE_RIGHT_EAT_POS = ['71%', '8.5%'];

const TAIL_STAND_POS = ['24%', '25%'];
const TAIL_SIT_POS = ['24%', '7%'];

const HEAD_STAND_POS_CENTER = [0.65, 0.45];
const HEAD_SIT_POS_CENTER = [0.66, 0.29];

const JUMP_START_DISTANCE = 2 * BODY_SPRITE_WIDTH;
const HOP_START_DISTANCE = 1 * BODY_SPRITE_WIDTH;
const WALK_START_DISTANCE = 0.3 * BODY_SPRITE_WIDTH;

const TURN_DISTANCE = 0.55 * BODY_SPRITE_WIDTH;
const JUMP_DISTANCE = 1 * BODY_SPRITE_WIDTH;
const HOP_DISTANCE = 0.3 * BODY_SPRITE_WIDTH;
const WALK_DISTANCE = 0.275 * BODY_SPRITE_WIDTH;
const WALK_TRANSITION_DISTANCE = 0.08 * BODY_SPRITE_WIDTH;

const BLINK_DELAY = {
    minDelay: 24,
    maxDelay: 30,
};
const TAIL_FLICK_DELAY = {
    minDelay: 0,
    maxDelay: 96,
};

const SHIKA_SCROLLBAR_DISTANCE = 30;

const FACE_MOUSE_SIDE_MAX_DISTANCE = 10;
const FACE_MOUSE_FRONT_BACK_MAX_SLOPE = 0.5;
const FACE_MOUSE_FRONT_BACK_MAX_DISTANCE = 200;
const FACE_MOUSE_PROB = 0.3;

const SHIKA_GLOBAL_GOAL_STATES = [
    {
        state: JUMP,
        predicate: (shika) => shika.distance > JUMP_START_DISTANCE,
    },
    {
        state: HOP,
        predicate: (shika) => shika.distance > HOP_START_DISTANCE,
    },
    {
        state: WALK,
        predicate: (shika) => shika.distance > WALK_START_DISTANCE,
    },
    {
        state: TURN,
        predicate: (shika) => shika.distance < -TURN_DISTANCE,
    },
];

const SHIKA_RANDOM_GOAL_STATES_FROM_STAND = [
    {
        state: SIT,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: EAT,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: IDLE,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: BACK,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: SIDE,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: UP,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
];

const SHIKA_RANDOM_GOAL_STATES_FROM_SIT = [
    {
        state: IDLE,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: SIT,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: SIT_BACK,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: SIT_SIDE,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    },
    {
        state: SIT_UP,
        weight: 1,
        minDelay: 24,
        maxDelay: 72,
    }
];

const SHIKA_EVENT_GOAL_STATES_FROM_STAND = [
    {
        state: IDLE,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_STAND_POS_CENTER, shika.direction);
            return isWithinProjectionX(
                headPosition, data.position,
                FACE_MOUSE_SIDE_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_SLOPE,
                shika.direction);
        },
        prob: FACE_MOUSE_PROB,
    },
    {
        state: BACK,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_STAND_POS_CENTER, shika.direction);
            return isWithinProjectionX(
                headPosition, data.position,
                FACE_MOUSE_SIDE_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_SLOPE,
                -shika.direction);
        },
        prob: FACE_MOUSE_PROB,
    },
    {
        state: SIDE,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_STAND_POS_CENTER, shika.direction);
            return isWithinDistance(headPosition, data.position, FACE_MOUSE_SIDE_MAX_DISTANCE);
        },
        prob: FACE_MOUSE_PROB,
    },
    {
        state: UP,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_STAND_POS_CENTER, shika.direction);
            return isWithinProjectionY(
                headPosition, data.position,
                FACE_MOUSE_SIDE_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_SLOPE,
                -1);
        },
        prob: FACE_MOUSE_PROB,
    }
];

const SHIKA_EVENT_GOAL_STATES_FROM_SIT = [
    {
        state: SIT,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_SIT_POS_CENTER, shika.direction);
            return isWithinProjectionX(
                headPosition, data.position,
                FACE_MOUSE_SIDE_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_SLOPE,
                shika.direction);
        },
        prob: FACE_MOUSE_PROB,
    },
    {
        state: SIT_BACK,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_SIT_POS_CENTER, shika.direction);
            return isWithinProjectionX(
                headPosition, data.position,
                FACE_MOUSE_SIDE_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_SLOPE,
                -shika.direction);
        },
        prob: FACE_MOUSE_PROB,
    },
    {
        state: SIT_SIDE,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_SIT_POS_CENTER, shika.direction);
            return isWithinDistance(headPosition, data.position, FACE_MOUSE_SIDE_MAX_DISTANCE);
        },
        prob: FACE_MOUSE_PROB,
    },
    {
        state: SIT_UP,
        event: 'MOUSE',
        predicate: (shika, data) => {
            const headPosition = getPositionOnSprite(shika.sprite, HEAD_SIT_POS_CENTER, shika.direction);
            return isWithinProjectionY(
                headPosition, data.position,
                FACE_MOUSE_SIDE_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_DISTANCE, FACE_MOUSE_FRONT_BACK_MAX_SLOPE,
                -1);
        },
        prob: FACE_MOUSE_PROB,
    }
];

const SHIKA_STATE_TRANSITIONS = {
    [IDLE]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        transitionFrames: {
            [WALK]: [
                BODY_WALK_ENTER_INDEX,
                BODY_WALK_ENTER_INDEX+1,
                BODY_WALK_INDEX,
            ],
            [BACK]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_FRONT_BACK_INDEX, pos: HEAD_STAND_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_FRONT_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                    eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [SIDE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_FRONT_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                    eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                    eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [UP]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_FRONT_UP_INDEX, pos: EAR_STAND_UP_POS },
                    eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [SIT]: [
                BODY_SIT_ENTER_INDEX,
                BODY_SIT_ENTER_INDEX+1,
                BODY_SIT_ENTER_INDEX+2,
                BODY_SIT_ENTER_INDEX+2,
                BODY_SIT_ENTER_INDEX+3,
                BODY_SIT_ENTER_INDEX+4,
                BODY_SIT_ENTER_INDEX+4,
                BODY_SIT_ENTER_INDEX+5,
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIT_ENTER_INDEX, pos: EAR_SIT_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                    tail: { frame: TAIL_SIT_ENTER_INDEX, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIT_ENTER_INDEX+1, pos: EAR_SIT_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                    tail: { frame: TAIL_SIT_ENTER_INDEX+1, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIT_ENTER_INDEX+2, pos: EAR_SIT_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                    tail: { frame: TAIL_SIT_ENTER_INDEX+2, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIT_ENTER_INDEX+3, pos: EAR_SIT_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                    tail: { frame: EAR_SIT_ENTER_INDEX+3, pos: TAIL_SIT_POS },
                } },
            ],
            [EAT]: [
                { frame: BODY_EAT_ENTER_INDEX, params: {
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_EAT_ENTER_INDEX+1, params: {
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_EAT_ENTER_INDEX+2, params: {
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_EAT_INDEX, params: {
                    ear: { frame: EAR_EAT_ENTER_INDEX, pos: EAR_EAT_POS },
                    eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_EAT_INDEX, params: {
                    ear: { frame: EAR_EAT_ENTER_INDEX+1, pos: EAR_EAT_POS },
                    eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_EAT_INDEX, params: {
                    ear: { frame: EAR_EAT_ENTER_INDEX+2, pos: EAR_EAT_POS },
                    eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [TURN]: BACK,
        },
        maintainPendingGoalStates: {
            [FRONT_BLINK]: true,
            [FRONT_TAIL_FLICK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_STAND,
            [{
                state: FRONT_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
            [{
                state: FRONT_TAIL_FLICK,
                weight: 1,
                ...TAIL_FLICK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_STAND,
    },
    [BACK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail:  {frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        transitionFrames: {
            [IDLE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_BACK_FRONT_INDEX, pos: HEAD_STAND_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_BACK_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos : EYE_RIGHT_STAND_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [SIDE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_BACK_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                    eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                    eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: IDLE,
            [HOP]:  IDLE,
            [WALK]: IDLE,
            [SIT]:  IDLE,
            [EAT]:  IDLE,
            [UP]:   IDLE,
        },
        maintainPendingGoalStates: {
            [BACK_BLINK]: true,
            [BACK_TAIL_FLICK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_STAND,
            [{
                state: BACK_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
            [{
                state: BACK_TAIL_FLICK,
                weight: 1,
                ...TAIL_FLICK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_STAND,
    },
    [SIDE]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail:  {frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        transitionFrames: {
            [IDLE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_SIDE_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [BACK]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_SIDE_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                    eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: IDLE,
            [HOP]:  IDLE,
            [WALK]: IDLE,
            [TURN]: BACK,
            [SIT]:  IDLE,
            [EAT]:  IDLE,
            [UP]:   IDLE,
        },
        maintainPendingGoalStates: {
            [SIDE_BLINK]: true,
            [SIDE_TAIL_FLICK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_STAND,
            [{
                state: SIDE_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
            [{
                state: SIDE_TAIL_FLICK,
                weight: 1,
                ...TAIL_FLICK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_STAND,
    },
    [UP]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail:  {frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        transitionFrames: {
            [IDLE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_UP_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: IDLE,
            [HOP]:  IDLE,
            [WALK]: IDLE,
            [TURN]: BACK,
            [SIT]:  IDLE,
            [EAT]:  IDLE,
            [BACK]: IDLE,
            [SIDE]: IDLE,
        },
        maintainPendingGoalStates: {
            [UP_BLINK]: true,
            [UP_TAIL_FLICK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_STAND,
            [{
                state: UP_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
            [{
                state: UP_TAIL_FLICK,
                weight: 1,
                ...TAIL_FLICK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_STAND,
    },
    [TURN]: {
        frames: [
          { frame: BODY_TURN_INDEX, action: (shika) => {
             shika.direction *= -1;
            shika.x += TURN_DISTANCE * shika.direction; } },
          BODY_TURN_INDEX+1,
          BODY_TURN_INDEX+2,
          BODY_TURN_INDEX+3,
          BODY_TURN_INDEX+4,
          BODY_TURN_INDEX+5,
          BODY_TURN_INDEX+6,
          BODY_TURN_INDEX+7,
          BODY_TURN_INDEX+8,
        ],
        goalStates: [
            {
                state: IDLE,
                predicate: (_shika) => true,
            },
        ],
    },
    [JUMP]: {
        frames: [
            BODY_JUMP_INDEX,
            BODY_JUMP_INDEX,
            { frame: BODY_JUMP_INDEX+1, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.direction; } },
            { frame: BODY_JUMP_INDEX+2, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.direction; } },
            { frame: BODY_JUMP_INDEX+3, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.direction; } },
            { frame: BODY_JUMP_INDEX+4, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.direction; } },
            { frame: BODY_JUMP_INDEX+5, action: (shika) => { shika.x += 0.2  * JUMP_DISTANCE * shika.direction; } },
            { frame: BODY_JUMP_INDEX+6, action: (shika) => { shika.x += 0.2  * JUMP_DISTANCE * shika.direction; } },
            BODY_JUMP_INDEX+7,
        ],
        goalStates: [
            {
                state: JUMP,
                predicate: (shika) => shika.distance > JUMP_DISTANCE,
            },
            {
                state: IDLE,
                predicate: (_shika) => true,
            },
        ],
    },
    [HOP]: {
        frames: [
            BODY_HOP_INDEX,
            { frame: BODY_HOP_INDEX+1, action: (shika) => { shika.x += 0.15 * HOP_DISTANCE * shika.direction; } },
            { frame: BODY_HOP_INDEX+2, action: (shika) => { shika.x += 0.15 * HOP_DISTANCE * shika.direction; } },
            { frame: BODY_HOP_INDEX+2, action: (shika) => { shika.x += 0.2  * HOP_DISTANCE * shika.direction; } },
            { frame: BODY_HOP_INDEX+3, action: (shika) => { shika.x += 0.2  * HOP_DISTANCE * shika.direction; } },
            { frame: BODY_HOP_INDEX+4, action: (shika) => { shika.x += 0.3  * HOP_DISTANCE * shika.direction; } },
        ],
        goalStates: [
            {
                state: JUMP,
                predicate: (shika) => shika.distance > JUMP_START_DISTANCE,
            },
            {
                state: HOP,
                predicate: (shika) => shika.distance > HOP_DISTANCE,
            },
            {
                state: IDLE,
                predicate: (_shika) => true,
            },
        ],
    },
    [WALK]: {
        frames: [
            { frame: BODY_WALK_INDEX+1, action: (shika) => {
                shika.x += (WALK_DISTANCE - WALK_TRANSITION_DISTANCE) * shika.direction; } },
            BODY_WALK_INDEX+2,
            BODY_WALK_INDEX+3,
            BODY_WALK_INDEX+4,
            BODY_WALK_INDEX+5,
            BODY_WALK_INDEX+6,
            BODY_WALK_INDEX+7,
            BODY_WALK_INDEX+0,
        ],
        transitionFrames: {
            [IDLE]: [
                { frame: BODY_WALK_EXIT_INDEX, action: (shika) => {
                    shika.x += WALK_TRANSITION_DISTANCE * shika.direction; } },
                BODY_WALK_EXIT_INDEX+1,
                BODY_WALK_EXIT_INDEX+2,
                BODY_WALK_EXIT_INDEX+3,
            ],
        },
        goalStates: [
            {
                state: JUMP,
                predicate: (shika) => shika.distance > JUMP_START_DISTANCE,
            },
            {
                state: HOP,
                predicate: (shika) => shika.distance > HOP_START_DISTANCE,
            },
            {
                state: WALK,
                predicate: (shika) => shika.distance > WALK_DISTANCE,
            },
            {
                state: IDLE,
                predicate: (_shika) => true,
            },
        ],
        goalStateIntermediaries: {
            [JUMP]: IDLE,
            [HOP]: IDLE,
        },
    },
    [SIT]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        transitionFrames: {
            [IDLE]: [
                BODY_SIT_EXIT_INDEX,
                BODY_SIT_EXIT_INDEX+1,
                BODY_SIT_EXIT_INDEX+1,
                BODY_SIT_EXIT_INDEX+2,
                BODY_SIT_EXIT_INDEX+3,
                BODY_SIT_EXIT_INDEX+3,
                BODY_SIT_EXIT_INDEX+4,
                BODY_SIT_EXIT_INDEX+5,
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_SIT_EXIT_INDEX, pos: EAR_STAND_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [SIT_BACK]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_BACK_INDEX, pos: HEAD_SIT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_FRONT_BACK_INDEX, pos: EAR_SIT_BACK_POS },
                    eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_SIT_BACK_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
            [SIT_SIDE]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_FRONT_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                    eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_SIT_SIDE_POS },
                    eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_SIT_SIDE_POS, flipX: true },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
            [SIT_UP]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_UP_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_FRONT_UP_INDEX, pos: EAR_SIT_UP_POS },
                    eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_SIT_UP_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: IDLE,
            [HOP]:  IDLE,
            [WALK]: IDLE,
            [TURN]: IDLE,
        },
        maintainPendingGoalStates: {
            [SIT_BLINK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_SIT,
            [{
                state: SIT_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_SIT,
    },
    [SIT_BACK]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_SIT_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_SIT_BACK_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        transitionFrames: {
            [SIT]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_BACK_FRONT_INDEX, pos: HEAD_SIT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_BACK_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
            [SIT_SIDE]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_BACK_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                    eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_SIT_SIDE_POS },
                    eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_SIT_SIDE_POS, flipX: true },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]:   SIT,
            [HOP]:    SIT,
            [WALK]:   SIT,
            [TURN]:   SIT,
            [IDLE]:   SIT,
            [SIT_UP]: SIT,
        },
        maintainPendingGoalStates: {
            [SIT_BACK_BLINK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_SIT,
            [{
                state: SIT_BACK_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_SIT,
    },
    [SIT_SIDE]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_SIT_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_SIT_SIDE_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        transitionFrames: {
            [SIT]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIDE_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
            [SIT_BACK]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIDE_BACK_INDEX, pos: EAR_SIT_BACK_POS },
                    eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_SIT_BACK_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]:   SIT,
            [HOP]:    SIT,
            [WALK]:   SIT,
            [TURN]:   SIT,
            [IDLE]:   SIT,
            [SIT_UP]: SIT,
        },
        maintainPendingGoalStates: {
            [SIT_SIDE_BLINK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_SIT,
            [{
                state: SIT_SIDE_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_SIT,
    },
    [SIT_UP]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_SIT_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_SIT_UP_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        transitionFrames: {
            [SIT]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_UP_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: SIT,
            [HOP]:  SIT,
            [WALK]: SIT,
            [TURN]: SIT,
            [IDLE]: SIT,
            [SIT_BACK]: SIT,
            [SIT_SIDE]: SIT,
        },
        maintainPendingGoalStates: {
            [SIT_UP_BLINK]: true,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_SIT,
            [{
                state: SIT_UP_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
        ],
        eventGoalStates: SHIKA_EVENT_GOAL_STATES_FROM_SIT,
    },
    [EAT]: {
        frames: [
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        transitionFrames: {
            [IDLE]: [
                { frame: BODY_EAT_EXIT_INDEX, params: {
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS }
                } },
                { frame: BODY_EAT_EXIT_INDEX+1, params: {
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS }
                } },
                { frame: BODY_EAT_EXIT_INDEX+2, params: {
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS }
                } },
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_EAT_EXIT_INDEX, pos: EAR_STAND_FRONT_POS },
                    eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: IDLE,
            [HOP]:  IDLE,
            [WALK]: IDLE,
            [TURN]: IDLE,
        },
        maintainPendingGoalStates: {
            [EAT_BLINK]: true,
            [EAT_TAIL_FLICK]: true,
        },
        randomGoalStates: [
            [{
                state: IDLE,
                weight: 1,
                minDelay: 24,
                maxDelay: 72,
            }],
            [{
                state: EAT_BLINK,
                weight: 1,
                ...BLINK_DELAY,
            }],
            [{
                state: EAT_TAIL_FLICK,
                weight: 1,
                ...TAIL_FLICK_DELAY,
            }],
        ],
    },
    [FRONT_BLINK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_BLINK_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_BLINK_INDEX+1, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_BLINK_INDEX+2, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [IDLE]: true,
        },
        goalStates: [
            {
                state: IDLE,
                predicate: (_shika) => true,
            }
        ],
    },
    [BACK_BLINK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_BLINK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_BLINK_INDEX+1, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_BLINK_INDEX+2, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [BACK]: true,
        },
        goalStates: [
            {
                state: BACK,
                predicate: (_shika) => true,
            }
        ],
    },
    [SIDE_BLINK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_BLINK_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_BLINK_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_BLINK_INDEX+1, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_BLINK_INDEX+1, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_BLINK_INDEX+2, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_BLINK_INDEX+2, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [SIDE]: true,
        },
        goalStates: [
            {
                state: SIDE,
                predicate: (_shika) => true,
            }
        ],
    },
    [UP_BLINK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_BLINK_INDEX, pos: EYE_RIGHT_STAND_UP_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_BLINK_INDEX+1, pos: EYE_RIGHT_STAND_UP_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_BLINK_INDEX+2, pos: EYE_RIGHT_STAND_UP_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [UP]: true,
        },
        goalStates: [
            {
                state: UP,
                predicate: (_shika) => true,
            }
        ],
    },
    [SIT_BLINK]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_BLINK_INDEX, pos: EYE_RIGHT_SIT_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_BLINK_INDEX+1, pos: EYE_RIGHT_SIT_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_BLINK_INDEX+2, pos: EYE_RIGHT_SIT_FRONT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [SIT]: true,
        },
        goalStates: [
            {
                state: SIT,
                predicate: (_shika) => true,
            }
        ],
    },
    [SIT_BACK_BLINK]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_SIT_BACK_POS },
                eyeLeft: { frame: EYE_BACK_BLINK_INDEX, pos: EYE_LEFT_SIT_BACK_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_SIT_BACK_POS },
                eyeLeft: { frame: EYE_BACK_BLINK_INDEX+1, pos: EYE_LEFT_SIT_BACK_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_SIT_BACK_POS },
                eyeLeft: { frame: EYE_BACK_BLINK_INDEX+2, pos: EYE_LEFT_SIT_BACK_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [SIT_BACK]: true,
        },
        goalStates: [
            {
                state: SIT_BACK,
                predicate: (_shika) => true,
            }
        ],
    },
    [SIT_SIDE_BLINK]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_BLINK_INDEX, pos: EYE_LEFT_SIT_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_BLINK_INDEX, pos: EYE_RIGHT_SIT_SIDE_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_BLINK_INDEX+1, pos: EYE_LEFT_SIT_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_BLINK_INDEX+1, pos: EYE_RIGHT_SIT_SIDE_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_BLINK_INDEX+2, pos: EYE_LEFT_SIT_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_BLINK_INDEX+2, pos: EYE_RIGHT_SIT_SIDE_POS, flipX: true },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [SIT_SIDE]: true,
        },
        goalStates: [
            {
                state: SIT_SIDE,
                predicate: (_shika) => true,
            }
        ],
    },
    [SIT_UP_BLINK]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_SIT_UP_POS },
                eyeRight: { frame: EYE_UP_BLINK_INDEX, pos: EYE_RIGHT_SIT_UP_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_SIT_UP_POS },
                eyeRight: { frame: EYE_UP_BLINK_INDEX+1, pos: EYE_RIGHT_SIT_UP_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_SIT_UP_POS },
                eyeRight: { frame: EYE_UP_BLINK_INDEX+2, pos: EYE_RIGHT_SIT_UP_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [SIT_UP]: true,
        },
        goalStates: [
            {
                state: SIT_UP,
                predicate: (_shika) => true,
            }
        ],
    },
    [EAT_BLINK]: {
        frames: [
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_BLINK_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_BLINK_INDEX+1, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_BLINK_INDEX+2, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [EAT]: true,
        },
        goalStates: [
            {
                state: EAT,
                predicate: (_shika) => true,
            }
        ],
    },
    [FRONT_TAIL_FLICK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                eyeRight: { frame: EYE_FRONT_INDEX, pos: EYE_RIGHT_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [IDLE]: true,
        },
        goalStates: [
            {
                state: IDLE,
                predicate: (_shika) => true,
            }
        ],
    },
    [BACK_TAIL_FLICK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                eyeLeft: { frame: EYE_BACK_INDEX, pos: EYE_LEFT_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [BACK]: true,
        },
        goalStates: [
            {
                state: BACK,
                predicate: (_shika) => true,
            }
        ],
    },
    [SIDE_TAIL_FLICK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                eyeLeft: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_LEFT_STAND_SIDE_POS },
                eyeRight: { frame: EYE_LEFT_SIDE_INDEX, pos: EYE_RIGHT_STAND_SIDE_POS, flipX: true },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [SIDE]: true,
        },
        goalStates: [
            {
                state: SIDE,
                predicate: (_shika) => true,
            }
        ],
    },
    [UP_TAIL_FLICK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_UP_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_UP_INDEX, pos: EAR_STAND_UP_POS },
                eyeRight: { frame: EYE_UP_INDEX, pos: EYE_RIGHT_STAND_UP_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [UP]: true,
        },
        goalStates: [
            {
                state: UP,
                predicate: (_shika) => true,
            }
        ],
    },
    [EAT_TAIL_FLICK]: {
        frames: [
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                eyeRight: { frame: EYE_EAT_INDEX, pos: EYE_RIGHT_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        maintainPendingGoalStates: {
            [EAT]: true,
        },
        goalStates: [
            {
                state: EAT,
                predicate: (_shika) => true,
            }
        ],
    },
};

export default function initShikaStateMachine() {
    const homeScrollbar = document.getElementById('home-scrollbar');
    
    const shikaSprite = document.getElementById('shika');
    const shikaHeadSprite = document.getElementById('shika-head');
    const shikaEarSprite  = document.getElementById('shika-ear');
    const shikaEyeLeftSprite  = document.getElementById('shika-eye-left');
    const shikaEyeRightSprite  = document.getElementById('shika-eye-right');
    const shikaTailSprite = document.getElementById('shika-tail');

    shikaSprite.style.width  = `${BODY_SPRITE_WIDTH}px`;
    shikaSprite.style.height = `${BODY_SPRITE_HEIGHT}px`;
    shikaSprite.style.backgroundSize = getBackgroundSize(BODY_SPRITESHEET_WIDTH, BODY_SPRITESHEET_HEIGHT);
    shikaSprite.style.backgroundImage = 'url(/assets/scrollbar/shika-body-spritesheet.png)';

    shikaHeadSprite.style.width  = `${HEAD_SPRITE_WIDTH}px`;
    shikaHeadSprite.style.height = `${HEAD_SPRITE_HEIGHT}px`;
    shikaHeadSprite.style.backgroundSize = getBackgroundSize(HEAD_SPRITESHEET_WIDTH, HEAD_SPRITESHEET_HEIGHT);
    shikaHeadSprite.style.backgroundImage = 'url(/assets/scrollbar/shika-head-spritesheet.png)';
    
    shikaEarSprite.style.width  = `${EAR_SPRITE_WIDTH}px`;
    shikaEarSprite.style.height = `${EAR_SPRITE_HEIGHT}px`;
    shikaEarSprite.style.backgroundSize  = getBackgroundSize(EAR_SPRITESHEET_WIDTH, EAR_SPRITESHEET_HEIGHT);
    shikaEarSprite.style.backgroundImage  = 'url(/assets/scrollbar/shika-ear-spritesheet.png)';
    
    shikaEyeLeftSprite.style.width  = `${EYE_SPRITE_WIDTH}px`;
    shikaEyeLeftSprite.style.height = `${EYE_SPRITE_HEIGHT}px`;
    shikaEyeLeftSprite.style.backgroundSize  = getBackgroundSize(EYE_SPRITESHEET_WIDTH, EYE_SPRITESHEET_HEIGHT);
    shikaEyeLeftSprite.style.backgroundImage  = 'url(/assets/scrollbar/shika-eye-spritesheet.png)';
    
    shikaEyeRightSprite.style.width  = `${EYE_SPRITE_WIDTH}px`;
    shikaEyeRightSprite.style.height = `${EYE_SPRITE_HEIGHT}px`;
    shikaEyeRightSprite.style.backgroundSize  = getBackgroundSize(EYE_SPRITESHEET_WIDTH, EYE_SPRITESHEET_HEIGHT);
    shikaEyeRightSprite.style.backgroundImage  = 'url(/assets/scrollbar/shika-eye-spritesheet.png)';

    shikaTailSprite.style.width  = `${TAIL_SPRITE_WIDTH}px`;
    shikaTailSprite.style.height = `${TAIL_SPRITE_HEIGHT}px`;
    shikaTailSprite.style.backgroundSize = getBackgroundSize(TAIL_SPRITESHEET_WIDTH, TAIL_SPRITESHEET_HEIGHT);
    shikaTailSprite.style.backgroundImage = 'url(/assets/scrollbar/shika-tail-spritesheet.png)';

    const shika = {
        x: 0,
        distance: 0,
        direction: 1,
        sprite: shikaSprite,
    };

    function update(frame) {
        const scrollbarX = parseFloat(homeScrollbar.offsetWidth);
        shika.distance = (scrollbarX - shika.x - SHIKA_SCROLLBAR_DISTANCE) * shika.direction;

        // apply transformations after changed by state machine
        shikaSprite.style.transform = `translateX(${shika.x}px) scaleX(${shika.direction})`;
        shikaSprite.style.backgroundPosition = getBackgroundPosition(BODY_SPRITESHEET_WIDTH, BODY_SPRITESHEET_HEIGHT, frame);

        // apply changes to other elements based on frame parameters
        // head
        if (shika.params?.head != null) {
            const { frame, pos: [x, y] } = shika.params.head;
            shikaHeadSprite.style.left = x;
            shikaHeadSprite.style.bottom = y;
            shikaHeadSprite.style.backgroundPosition = getBackgroundPosition(HEAD_SPRITESHEET_WIDTH, HEAD_SPRITESHEET_HEIGHT, frame);
            shikaHeadSprite.style.display = 'block';
        } else {
            shikaHeadSprite.style.display = 'none';
        }
        // ear
        if (shika.params?.ear != null) {
            const { frame, pos: [x, y] } = shika.params.ear;
            shikaEarSprite.style.left = x;
            shikaEarSprite.style.bottom = y;
            shikaEarSprite.style.backgroundPosition = getBackgroundPosition(EAR_SPRITESHEET_WIDTH, EAR_SPRITESHEET_HEIGHT, frame);
            shikaEarSprite.style.display = 'block';
        } else {
            shikaEarSprite.style.display = 'none';
        }
        // eye
        const eyeLeftSprite  = shika.direction === -1 ? shikaEyeRightSprite : shikaEyeLeftSprite;
        const eyeRightSprite = shika.direction === -1 ? shikaEyeLeftSprite : shikaEyeRightSprite;
        if (shika.params?.eyeLeft != null) {
            const { frame, pos: [x, y], flipX } = shika.params.eyeLeft;
            eyeLeftSprite.style.left = x;
            eyeLeftSprite.style.bottom = y;
            if (flipX) { eyeLeftSprite.transform = '`scaleX(-1)'; }
            eyeLeftSprite.style.backgroundPosition = getBackgroundPosition(EYE_SPRITESHEET_WIDTH, EYE_SPRITESHEET_HEIGHT, frame);
            eyeLeftSprite.style.display = 'block';
        } else {
            eyeLeftSprite.style.display = 'none';
        }
        if (shika.params?.eyeRight != null) {
            const { frame, pos: [x, y], flipX } = shika.params.eyeRight;
            eyeRightSprite.style.left = x;
            eyeRightSprite.style.bottom = y;
            if (flipX) { eyeRightSprite.transform = '`scaleX(-1)'; }
            eyeRightSprite.style.backgroundPosition = getBackgroundPosition(EYE_SPRITESHEET_WIDTH, EYE_SPRITESHEET_HEIGHT, frame);
            eyeRightSprite.style.display = 'block';
        } else {
            eyeRightSprite.style.display = 'none';
        }
        // tail
        if (shika.params?.tail != null) {
            const { frame, pos: [x, y] } = shika.params.tail;
            shikaTailSprite.style.left = x;
            shikaTailSprite.style.bottom = y;
            shikaTailSprite.style.backgroundPosition = getBackgroundPosition(TAIL_SPRITESHEET_WIDTH, TAIL_SPRITESHEET_HEIGHT, frame);
            shikaTailSprite.style.display = 'block';
        } else {
            shikaTailSprite.style.display = 'none';
        }
    }

    return new StateMachine(
        SHIKA_NAME,
        IDLE,
        SHIKA_GLOBAL_GOAL_STATES,
        SHIKA_STATE_TRANSITIONS,
        shika,
        update
    );
}
