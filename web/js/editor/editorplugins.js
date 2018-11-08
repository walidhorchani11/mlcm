'use strict';

import { less }                 from './editor-plugins/less';
import { selection }            from './editor-plugins/selection';
import { pasteImageReader }     from './editor-plugins/paste-image-reader';
import { katex }                from './editor-plugins/katex.min';

const editorplugins = { less, selection, pasteImageReader, katex };

module.exports = editorplugins;
