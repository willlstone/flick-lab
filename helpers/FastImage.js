import React, { memo, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Animated, Image } from "react-native";

const findExt = filename => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

const checkImageInCache = async uri => {
    try {
        return await FileSystem.getInfoAsync(uri);
    } catch (err) {
        return false;
    }
}

const cacheImage = async (link, localUrl, callback) => {
    try {

        const downloadImage = FileSystem.createDownloadResumable(
            link, localUrl, {}, callback
        );

        return (await downloadImage.downloadAsync()).uri;

    } catch (error) {

        console.log("errrrrr: ", error);

        return false;
    }
}

export default memo(({ uri, cacheKey, style, animated, addLogging, ...props }) => {

    const encodedLink = encodeURI(uri);
    const [imgUrl, setUrl] = useState(`${FileSystem.cacheDirectory}${cacheKey}`);
    const [existed, setExisted] = useState(false);

    useEffect(() => {

        (async () => {

            // if (cacheKey === '551271-poster') {
            //     // console.log('does medieval esist:');
            // const medExists = await checkImageInCache(`${FileSystem.cacheDirectory}551271-poster`);
            // console.log('MED EXISTANCE: ', medExists.exists);
            // }
            
            const cacheFileUri = `${FileSystem.cacheDirectory}${cacheKey}`;
            let imgInCache = await checkImageInCache(cacheFileUri);

            if (!imgInCache.exists) {
                let cached = await cacheImage(encodedLink, cacheFileUri, () => { });
                if (cached) { setUrl(`${cacheFileUri}/m`); setUrl(cached); }
            }
            else {
                setExisted(true);
            }
        })();

    }, []);

    // if (animated) {
    //     return <Animated.Image source={{ uri: imgUrl }} style={style} {...props} onError={() => setUrl(uri)} />
    // }
    if (existed) {
        {addLogging && console.log('image EXISTED before -- serving up cached');}
        return <Image source={{ uri: imgUrl }} style={style} {...props} onError={() => setUrl(uri)} />

    }
    else {
        {addLogging && console.log('image was NOT in the cache: serving up with uri');}
        return <Image source={{ uri: uri }} style={style} {...props} onError={() => setUrl(uri)} />
    }
});