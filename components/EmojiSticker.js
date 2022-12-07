import { View, Image } from 'react-native';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function EmojiSticker({ imageSize, stickerSource }) {

    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const scaleImage = useSharedValue(imageSize)

    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () => {
            if (scaleImage.value) {
                scaleImage.value *= 2
            }
        }
    })

    const onDrag = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translateX = translateX.value
            context.translateY = translateY.value
        },
        onActive: (event, context) => {
            translateX.value = context.translateX + event.translationX
            translateY.value = context.translateY + event.translationY
        },
    })

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        }
    })

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        }
    })

    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            <AnimatedView style={[containerStyle, { top: -350 }]}>
                <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                    <AnimatedImage
                        source={stickerSource}
                        style={[imageStyle, { width: imageSize, height: imageSize }]}
                        resizeMode="contain"
                    />
                </TapGestureHandler>
            </AnimatedView>
        </PanGestureHandler>
    )
}