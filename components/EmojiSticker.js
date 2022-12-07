import { View, Image } from 'react-native';

export default function EmojiSticker({ imageSize, stickerSource }) {
    return (
        <View style={{ top: -350 }}>
            <Image
                source={stickerSource}
                style={{ width: imageSize, height: imageSize }}
                resizeMode="contain"
            />
        </View>
    )
}