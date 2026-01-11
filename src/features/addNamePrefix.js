import { lib, get, _status, ui, game, ai } from 'noname';
import { onPrecontent } from "../utils/hooks.js"

onPrecontent(async () => {
    /* <-------------------------往lib.namePrefix添加武将前缀-------------------------> */
    if (lib.namePrefix) {
        lib.namePrefix.set('PS', {
            color: '#fdd559',
            nature: 'soilmm',
            // showName: '℗',
            getSpan: (prefix, name) => {
                const span = document.createElement('span'), style = span.style;
                style.writingMode = style.webkitWritingMode = 'horizontal-tb';
                style.fontFamily = 'MotoyaLMaru';
                style.transform = 'scaleY(0.85)';
                span.textContent = 'PS';
                return span.outerHTML;
            },
        });
        lib.namePrefix.set('PS神', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('神')}`;
            },
        });
        lib.namePrefix.set('PS梦', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('梦')}`;
            },
        });
        lib.namePrefix.set('PS武', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('武')}`;
            },
        });
        lib.namePrefix.set('PS晋', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('晋')}`;
            },
        });
        lib.namePrefix.set('PS乐', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('乐')}`;
            },
        });
        lib.namePrefix.set('PS经典', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('经典')}`;
            },
        });
        lib.namePrefix.set('PS界', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('界')}`;
            },
        });
        lib.namePrefix.set('PS谋', {
            getSpan: (prefix, name) => {
                return `${get.prefixSpan('PS')}${get.prefixSpan('谋')}`;
            },
        });
    }
});