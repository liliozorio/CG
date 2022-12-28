import * as THREE from 'three';

var audioLoader = new THREE.AudioLoader();

function trilhaSonora(listener) {
    var trilha_sonora = new THREE.Audio(listener);
    audioLoader.load('./sounds/trilha_sonora.mp3', function (buffer) {
        trilha_sonora.setBuffer(buffer);
        trilha_sonora.setLoop(true);
        trilha_sonora.setVolume(0.3);
        //sound.play(); // Will play when start button is pressed
    });
    return trilha_sonora
    // trilhaSonora.play();
}



function effects(name_sound,listener) {
    const sound = new THREE.Audio(listener);
    audioLoader.load(`./sounds/${name_sound}.mp3`, function (buffer) {
        sound.setBuffer(buffer);
        // sound.setLoop(true);
        // sound.setVolume(0.7);
    });
    return sound;
}
export { trilhaSonora, effects}