type AudioFormat = 'mp3' | 'flac' | 'wav' | 'ogg';

interface AudioFile {
  name: string;
  format: AudioFormat;
}

interface Decoder {
  decode(file: AudioFile): void;
}

class Mp3Decoder implements Decoder {
  decode(file: AudioFile): void {
    console.log(`Decoding MP3: ${file.name}`);
  }
}

class FlacDecoder implements Decoder {
  decode(file: AudioFile): void {
    console.log(`Decoding FLAC: ${file.name}`);
  }
}

class WavDecoder implements Decoder {
  decode(file: AudioFile): void {
    console.log(`Decoding WAV: ${file.name}`);
  }
}

class OggDecoder implements Decoder {
  decode(file: AudioFile): void {
    console.log(`Decoding OGG: ${file.name}`);
  }
}

function createDecoder(format: AudioFormat): Decoder {
  switch (format) {
    case 'mp3':
      return new Mp3Decoder();

    case 'flac':
      return new FlacDecoder();

    case 'wav':
      return new WavDecoder();

    case 'ogg':
      return new OggDecoder();

    default:
      throw new Error('throw new Error(`Unsupported format: ${format}`)');
  }
}

class Player {
  load(file: AudioFile): void {
    const decoder = createDecoder(file.format);
    decoder.decode(file);
  }
}

const player = new Player();

player.load({
  name: 'song.mp3',
  format: 'mp3',
});

player.load({
  name: 'song.ogg',
  format: 'ogg',
});

// player.load({
//   name: 'song.unknown',
//   format: 'unknownFormat',
// });
