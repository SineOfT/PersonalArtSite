
export const lerp = (a, b, t) => a * (1-t) + b * t;

export function getPositionOnSprite(sprite, [x, y], direction) {
    const bounds = sprite.getBoundingClientRect();
    return [
        direction < 0
            ? bounds.right - bounds.width * x
            : bounds.left  + bounds.width * x,
        bounds.bottom - bounds.height * y,
    ]
};

export function isWithinDistance(pointA, pointB, maxDistance) {
    const distanceX = Math.abs(pointB[0] - pointA[0]);
    const distanceY = Math.abs(pointB[1] - pointA[1]);
    return distanceX < maxDistance && distanceY < maxDistance;
}

export function isWithinProjectionX(pointA, pointB, minDistance, maxDistance, maxSlope, direction) {
    const displacementX = (pointB[0] - pointA[0]) * direction;
    const distanceX = Math.abs(displacementX);
    const distanceY = Math.abs(pointB[1] - pointA[1]);
    const slope = distanceX === 0 ? Infinity : distanceY / distanceX;
    return slope < maxSlope && displacementX >= minDistance && displacementX < maxDistance;
}

export function isWithinProjectionY(pointA, pointB, minDistance, maxDistance, maxSlope, direction) {
    const distanceX = Math.abs(pointB[0] - pointA[0]);
    const displacementY = (pointB[1] - pointA[1]) * direction;
    const distanceY = Math.abs(displacementY);
    const slope = distanceY === 0 ? Infinity : distanceX / distanceY;
    return slope < maxSlope && displacementY >= minDistance && displacementY < maxDistance;
}