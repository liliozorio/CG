// CHECK IF HAVE COLLISION
export function checkCollisions(object, man) {
    try {
        if(object != null && man.bb != null)
            {
            let collision = man.bb.intersectsBox(object);
            if (collision) {
                return true;
            }
        }
    }
    catch (e) {

        for (var i = 0; i < object.length; i++) {
            if(object[i] != null)
            {
                let collision = man.bb.intersectsBox(object[i]);
                if (collision) {
                    return true;
            }}
        }
    }
    return false
}

// CHECK IF PLATAFORMS ARE PRESSED 
export function checkOpenDoorRoom(i, f, platforms) {
    try
    {
        for (; i < f; i++) {
            if (!platforms.pressed[i])
                return false;
        }
        return true
    }
    catch (e) {

    }
}

// CATCHES THE OBJECT THAT COLLIDED
export function getColissionObjectId(object, man) {
    for (var i = 0; i < object.length; i++) {
        let collision = man.bb.intersectsBox(object[i]);
        if (collision) {
            return i;
        }
    }
    return -1;
}
