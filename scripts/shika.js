import StateMachine, { getBackgroundSize, getBackgroundPosition } from "/scripts/state-machine.js";

const FPS = 10;
const FRAME_DURATION_MS = 1000/FPS;

const BODY_SPRITESHEET_WIDTH = 10;
const BODY_SPRITESHEET_HEIGHT = 6;
const BODY_SPRITE_WIDTH = 128;
const BODY_SPRITE_HEIGHT = 128;

const HEAD_SPRITESHEET_WIDTH = 5;
const HEAD_SPRITESHEET_HEIGHT = 1;
const HEAD_SPRITE_WIDTH  = BODY_SPRITE_WIDTH  * 3/8;
const HEAD_SPRITE_HEIGHT = BODY_SPRITE_HEIGHT * 3/8;

const EAR_SPRITESHEET_WIDTH = 5;
const EAR_SPRITESHEET_HEIGHT = 4;
const EAR_SPRITE_WIDTH  = BODY_SPRITE_WIDTH  / 4;
const EAR_SPRITE_HEIGHT = BODY_SPRITE_HEIGHT / 4;

const TAIL_SPRITESHEET_WIDTH = 4;
const TAIL_SPRITESHEET_HEIGHT = 3;
const TAIL_SPRITE_WIDTH  = BODY_SPRITE_WIDTH  / 8;
const TAIL_SPRITE_HEIGHT = BODY_SPRITE_HEIGHT / 8;

const IDLE = 'IDLE';
const BACK = 'BACK';
const SIDE = 'SIDE';
const TURN = 'TURN';
const JUMP = 'JUMP';
const HOP  = 'HOP';
const WALK = 'WALK';
const SIT = 'SIT';
const SIT_BACK = 'SIT_BACK';
const SIT_SIDE = 'SIT_SIDE';
const EAT = 'EAT';
const FRONT_TAIL_FLICK = 'FRONT_TAIL_FLICK';
const BACK_TAIL_FLICK = 'BACK_TAIL_FLICK';
const SIDE_TAIL_FLICK = 'SIDE_TAIL_FLICK';
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
const HEAD_FRONT_BACK_INDEX = 3;
const HEAD_BACK_FRONT_INDEX = 4;

const EAR_FRONT_INDEX = 0;
const EAR_BACK_INDEX = 1;
const EAR_SIDE_INDEX = 2;
const EAR_FRONT_BACK_INDEX = 3;
const EAR_BACK_FRONT_INDEX = 4;
const EAR_FRONT_SIDE_INDEX = 5;
const EAR_SIDE_BACK_INDEX = 6;
const EAR_BACK_SIDE_INDEX = 7;
const EAR_SIDE_FRONT_INDEX = 8;
const EAR_SIT_ENTER_INDEX = 9;
const EAR_SIT_EXIT_INDEX = 13;
const EAR_EAT_ENTER_INDEX = 14;
const EAR_EAT_INDEX = 17;
const EAR_EAT_EXIT_INDEX = 18;

const TAIL_INDEX = 0;
const TAIL_FLICK_INDEX = 1;
const TAIL_SIT_ENTER_INDEX = 7;

const HEAD_STAND_POS = ['41%', '20%'];
const HEAD_SIT_POS = ['42%', '4%'];

const EAR_STAND_FRONT_POS = ['49%', '41%'];
const EAR_STAND_BACK_POS  = ['46%', '41%'];
const EAR_STAND_SIDE_POS  = ['49%', '41%'];
const EAR_SIT_FRONT_POS = ['51%', '25%'];
const EAR_SIT_BACK_POS  = ['48%', '25%'];
const EAR_SIT_SIDE_POS  = ['51%', '25%'];
const EAR_EAT_POS = ['62%', '10%'];

const TAIL_STAND_POS = ['24%', '25%'];
const TAIL_SIT_POS = ['24%', '7%'];

const JUMP_START_DISTANCE = 2;
const HOP_START_DISTANCE = 1;
const WALK_START_DISTANCE = 0.3;

const TURN_DISTANCE = 0.55;
const JUMP_DISTANCE = 1;
const HOP_DISTANCE = 0.3;
const WALK_DISTANCE = 0.275;
const WALK_TRANSITION_DISTANCE = 0.08;
 
const SHIKA_GLOBAL_GOAL_STATES = [
    {
        state: JUMP,
        predicate: (shika) => shika.distance > JUMP_START_DISTANCE * shika.width
    },
    {
        state: HOP,
        predicate: (shika) => shika.distance > HOP_START_DISTANCE  * shika.width,
    },
    {
        state: WALK,
        predicate: (shika) => shika.distance > WALK_START_DISTANCE * shika.width,
    },
    {
        state: TURN,
        predicate: (shika) => shika.distance < -TURN_DISTANCE * shika.width,
    },
];

const SHIKA_RANDOM_GOAL_STATES_FROM_IDLE = [
    {
        state: SIT,
        weight: 2,
        minDelay: 24,
        maxDelay: 48,
    },
    {
        state: EAT,
        weight: 2,
        minDelay: 24,
        maxDelay: 48,
    },
    {
        state: IDLE,
        weight: 3,
        minDelay: 12,
        maxDelay: 24,
    },
    {
        state: BACK,
        weight: 3,
        minDelay: 12,
        maxDelay: 24,
    },
    {
        state: SIDE,
        weight: 3,
        minDelay: 12,
        maxDelay: 24,
    },
];

const SHIKA_RANDOM_GOAL_STATES_FROM_SIT = [
    {
        state: IDLE,
        weight: 1,
        minDelay: 24,
        maxDelay: 48,
    },
    {
        state: SIT,
        weight: 1,
        minDelay: 6,
        maxDelay: 24,
    },
    {
        state: SIT_BACK,
        weight: 1,
        minDelay: 6,
        maxDelay: 24,
    },
    {
        state: SIT_SIDE,
        weight: 1,
        minDelay: 6,
        maxDelay: 24,
    },
];

const SHIKA_STATE_TRANSITIONS = {
    [IDLE]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
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
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [SIDE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_FRONT_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
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
                    tail: { frame: TAIL_SIT_ENTER_INDEX, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIT_ENTER_INDEX+1, pos: EAR_SIT_FRONT_POS },
                    tail: { frame: TAIL_SIT_ENTER_INDEX+1, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIT_ENTER_INDEX+2, pos: EAR_SIT_FRONT_POS },
                    tail: { frame: TAIL_SIT_ENTER_INDEX+2, pos: TAIL_SIT_POS },
                } },
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIT_ENTER_INDEX+3, pos: EAR_SIT_FRONT_POS },
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
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_EAT_INDEX, params: {
                    ear: { frame: EAR_EAT_ENTER_INDEX+1, pos: EAR_EAT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
                { frame: BODY_EAT_INDEX, params: {
                    ear: { frame: EAR_EAT_ENTER_INDEX+2, pos: EAR_EAT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [TURN]: BACK,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_IDLE,
            [{
                state: FRONT_TAIL_FLICK,
                weight: 1,
                minDelay: 0,
                maxDelay: 96,
            }],
        ],
    },
    [BACK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
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
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [SIDE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_BACK_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
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
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_IDLE,
            [{
                state: BACK_TAIL_FLICK,
                weight: 1,
                minDelay: 0,
                maxDelay: 96,
            }],
        ],
    },
    [SIDE]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail:  {frame: TAIL_INDEX, pos: TAIL_STAND_POS },
            } },
        ],
        transitionFrames: {
            [IDLE]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_SIDE_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_STAND_POS },
                } },
            ],
            [BACK]: [
                { frame: BODY_STAND_INDEX, params: {
                    head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                    ear: { frame: EAR_SIDE_BACK_INDEX, pos: EAR_STAND_BACK_POS },
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
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_IDLE,
            [{
                state: SIDE_TAIL_FLICK,
                weight: 1,
                minDelay: 0,
                maxDelay: 96,
            }],
        ],
    },
    [TURN]: {
        frames: [
          { frame: BODY_TURN_INDEX, action: (shika) => {
             shika.direction *= -1;
            shika.x += TURN_DISTANCE * shika.width * shika.direction; } },
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
            { frame: BODY_JUMP_INDEX+1, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_JUMP_INDEX+2, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_JUMP_INDEX+3, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_JUMP_INDEX+4, action: (shika) => { shika.x += 0.15 * JUMP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_JUMP_INDEX+5, action: (shika) => { shika.x += 0.2  * JUMP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_JUMP_INDEX+6, action: (shika) => { shika.x += 0.2  * JUMP_DISTANCE * shika.width * shika.direction; } },
            BODY_JUMP_INDEX+7,
        ],
        goalStates: [
            {
                state: JUMP,
                predicate: (shika) => shika.distance > JUMP_DISTANCE * shika.width,
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
            { frame: BODY_HOP_INDEX+1, action: (shika) => { shika.x += 0.15 * HOP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_HOP_INDEX+2, action: (shika) => { shika.x += 0.15 * HOP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_HOP_INDEX+2, action: (shika) => { shika.x += 0.2  * HOP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_HOP_INDEX+3, action: (shika) => { shika.x += 0.2  * HOP_DISTANCE * shika.width * shika.direction; } },
            { frame: BODY_HOP_INDEX+4, action: (shika) => { shika.x += 0.3  * HOP_DISTANCE * shika.width * shika.direction; } },
        ],
        goalStates: [
            {
                state: JUMP,
                predicate: (shika) => shika.distance > JUMP_START_DISTANCE * shika.width,
            },
            {
                state: HOP,
                predicate: (shika) => shika.distance > HOP_DISTANCE * shika.width,
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
                shika.x += (WALK_DISTANCE - WALK_TRANSITION_DISTANCE) * shika.width * shika.direction; } },
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
                    shika.x += WALK_TRANSITION_DISTANCE * shika.width * shika.direction; } },
                BODY_WALK_EXIT_INDEX+1,
                BODY_WALK_EXIT_INDEX+2,
                BODY_WALK_EXIT_INDEX+3,
            ],
        },
        goalStates: [
            {
                state: JUMP,
                predicate: (shika) => shika.distance > JUMP_START_DISTANCE * shika.width,
            },
            {
                state: HOP,
                predicate: (shika) => shika.distance > HOP_START_DISTANCE * shika.width,
            },
            {
                state: WALK,
                predicate: (shika) => shika.distance > WALK_DISTANCE * shika.width,
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
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
            [SIT_SIDE]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_FRONT_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
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
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_SIT,
        ],
    },
    [SIT_BACK]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_SIT_BACK_POS },
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
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
            [SIT_SIDE]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_BACK_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: SIT,
            [HOP]: SIT,
            [WALK]: SIT,
            [TURN]: SIT,
            [IDLE]: SIT,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_SIT,
        ],
    },
    [SIT_SIDE]: {
        frames: [
            { frame: BODY_SIT_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_SIT_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_SIT_SIDE_POS },
                tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
            } },
        ],
        transitionFrames: {
            [SIT]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_FRONT_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIDE_FRONT_INDEX, pos: EAR_SIT_FRONT_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
            [SIT_BACK]: [
                { frame: BODY_SIT_INDEX, params: {
                    head: { frame: HEAD_BACK_INDEX, pos: HEAD_SIT_POS },
                    ear: { frame: EAR_SIDE_BACK_INDEX, pos: EAR_SIT_BACK_POS },
                    tail: { frame: TAIL_INDEX, pos: TAIL_SIT_POS },
                } },
            ],
        },
        goalStateIntermediaries: {
            [JUMP]: SIT,
            [HOP]: SIT,
            [WALK]: SIT,
            [TURN]: SIT,
            [IDLE]: SIT,
        },
        randomGoalStates: [
            SHIKA_RANDOM_GOAL_STATES_FROM_SIT,
        ],
    },
    [EAT]: {
        frames: [
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
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
        randomGoalStates: [
            [{
                state: IDLE,
                weight: 1,
                minDelay: 24,
                maxDelay: 48,
            }],
            [{
                state: EAT_TAIL_FLICK,
                weight: 1,
                minDelay: 0,
                maxDelay: 96,
            }],
        ],
    },
    [FRONT_TAIL_FLICK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_FRONT_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_FRONT_INDEX, pos: EAR_STAND_FRONT_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        goalStates: [
            {
                state: IDLE,
                predicate: (_shika) => true,
                maintainPendingGoalStates: true,
            }
        ],
    },
    [BACK_TAIL_FLICK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_BACK_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_BACK_INDEX, pos: EAR_STAND_BACK_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        goalStates: [
            {
                state: BACK,
                predicate: (_shika) => true,
                maintainPendingGoalStates: true,
            }
        ],
    },
    [SIDE_TAIL_FLICK]: {
        frames: [
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_STAND_INDEX, params: {
                head: { frame: HEAD_SIDE_INDEX, pos: HEAD_STAND_POS },
                ear: { frame: EAR_SIDE_INDEX, pos: EAR_STAND_SIDE_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        goalStates: [
            {
                state: SIDE,
                predicate: (_shika) => true,
                maintainPendingGoalStates: true,
            }
        ],
    },
    [EAT_TAIL_FLICK]: {
        frames: [
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+1, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+2, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+3, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+4, pos: TAIL_STAND_POS },
            } },
            { frame: BODY_EAT_INDEX, params: {
                ear: { frame: EAR_EAT_INDEX, pos: EAR_EAT_POS },
                tail: { frame: TAIL_FLICK_INDEX+5, pos: TAIL_STAND_POS },
            } },
        ],
        goalStates: [
            {
                state: EAT,
                predicate: (_shika) => true,
                maintainPendingGoalStates: true,
            }
        ],
    },
};

export default function initShika() {
    const homeScrollbar = document.getElementById('home-scrollbar');
    
    const shikaImg = document.getElementById('shika');
    const shikaHeadImg = document.getElementById('shika-head');
    const shikaEarImg  = document.getElementById('shika-ear');
    const shikaTailImg = document.getElementById('shika-tail');

    shikaImg.style.width  = `${BODY_SPRITE_WIDTH}px`;
    shikaImg.style.height = `${BODY_SPRITE_HEIGHT}px`;
    shikaImg.style.backgroundSize = getBackgroundSize(BODY_SPRITESHEET_WIDTH, BODY_SPRITESHEET_HEIGHT);
    shikaImg.style.backgroundImage = 'url(/assets/scrollbar/shika-body-spritesheet.png)';

    shikaHeadImg.style.width  = `${HEAD_SPRITE_WIDTH}px`;
    shikaHeadImg.style.height = `${HEAD_SPRITE_HEIGHT}px`;
    shikaHeadImg.style.backgroundSize = getBackgroundSize(HEAD_SPRITESHEET_WIDTH, HEAD_SPRITESHEET_HEIGHT);
    shikaHeadImg.style.backgroundImage = 'url(/assets/scrollbar/shika-head-spritesheet.png)';
    
    shikaEarImg.style.width  = `${EAR_SPRITE_WIDTH}px`;
    shikaEarImg.style.height = `${EAR_SPRITE_HEIGHT}px`;
    shikaEarImg.style.backgroundSize  = getBackgroundSize(EAR_SPRITESHEET_WIDTH,  EAR_SPRITESHEET_HEIGHT);
    shikaEarImg.style.backgroundImage  = 'url(/assets/scrollbar/shika-ear-spritesheet.png)';

    shikaTailImg.style.width  = `${TAIL_SPRITE_WIDTH}px`;
    shikaTailImg.style.height = `${TAIL_SPRITE_HEIGHT}px`;
    shikaTailImg.style.backgroundSize = getBackgroundSize(TAIL_SPRITESHEET_WIDTH, TAIL_SPRITESHEET_HEIGHT);
    shikaTailImg.style.backgroundImage = 'url(/assets/scrollbar/shika-tail-spritesheet.png)';

    const shika = {
        x: 0,
        distance: 0,
        width: BODY_SPRITE_WIDTH,
        height: BODY_SPRITE_HEIGHT,
        direction: 1,
    };
    const stateMachine = new StateMachine(IDLE, SHIKA_GLOBAL_GOAL_STATES, SHIKA_STATE_TRANSITIONS, shika);

    let previousFrameTimestamp = 0;
    function update(timestamp) {
        // only update once this frame has been shown for its duration
        if (previousFrameTimestamp + FRAME_DURATION_MS < timestamp) {
            // if skipped multiple frame timestamps, set previous to most recent timestamp
            previousFrameTimestamp += FRAME_DURATION_MS * Math.floor((timestamp - previousFrameTimestamp) / FRAME_DURATION_MS);
            
            const scrollbarX = parseFloat(homeScrollbar.offsetWidth);
            shika.distance = (scrollbarX - shika.x) * shika.direction;

            const frame = stateMachine.tick();
            // apply transformations after changed by state machine
            shikaImg.style.transform = `translateX(${shika.x}px) scaleX(${shika.direction})`;
            shikaImg.style.backgroundPosition = getBackgroundPosition(BODY_SPRITESHEET_WIDTH, BODY_SPRITESHEET_HEIGHT, frame);

            // apply changes to other elements based on frame parameters
            // head
            if (shika.params?.head != null) {
                const { frame, pos: [x, y] } = shika.params.head;
                shikaHeadImg.style.left = x;
                shikaHeadImg.style.bottom = y;
                shikaHeadImg.style.backgroundPosition = getBackgroundPosition(HEAD_SPRITESHEET_WIDTH, HEAD_SPRITESHEET_HEIGHT, frame);
                shikaHeadImg.style.display = 'block';
            } else {
                shikaHeadImg.style.display = 'none';
            }
            // ear
            if (shika.params?.ear != null) {
                const { frame, pos: [x, y] } = shika.params.ear;
                shikaEarImg.style.left = x;
                shikaEarImg.style.bottom = y;
                shikaEarImg.style.backgroundPosition = getBackgroundPosition(EAR_SPRITESHEET_WIDTH, EAR_SPRITESHEET_HEIGHT, frame);
                shikaEarImg.style.display = 'block';
            } else {
                shikaEarImg.style.display = 'none';
            }
            // tail
            if (shika.params?.tail != null) {
                const { frame, pos: [x, y] } = shika.params.tail;
                shikaTailImg.style.left = x;
                shikaTailImg.style.bottom = y;
                shikaTailImg.style.backgroundPosition = getBackgroundPosition(TAIL_SPRITESHEET_WIDTH, TAIL_SPRITESHEET_HEIGHT, frame);
                shikaTailImg.style.display = 'block';
            } else {
                shikaTailImg.style.display = 'none';
            }
        }
        window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update);
}
