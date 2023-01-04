import * as THREE from 'three';

function trilhaSonora(listener,audioLoader) {
    var trilha_sonora = new THREE.Audio(listener);
    audioLoader.load('./sounds/trilha_sonora.mp3', function (buffer) {
        trilha_sonora.setBuffer(buffer);
        trilha_sonora.setLoop(true);
        trilha_sonora.setVolume(0.1);
    });
    return trilha_sonora
}

function effects(name_sound,listener,audioLoader) {
    const sound = new THREE.Audio(listener);
    audioLoader.load(`./sounds/${name_sound}`, function (buffer) {
        sound.setBuffer(buffer);
        sound.setVolume(0.8);
    });
    return sound;
}

function playSound(sound){
    if(!sound.isPlaying)
        sound.play();
}
export { trilhaSonora, effects, playSound };