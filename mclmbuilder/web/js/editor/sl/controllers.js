'use strict';

import * as controllers_api             from './controllers/controllers_api';
import * as controllers_blocks          from './controllers/controllers_blocks';
import * as controllers_capabilities    from './controllers/controllers_capabilities';
import * as controllers_contrast        from './controllers/controllers_contrast';
import * as controllers_deckImport      from './controllers/controllers_deckImport';
import * as controllers_grid            from './controllers/controllers_grid';
import * as controllers_guides          from './controllers/controllers_guides';
import * as controllers_history         from './controllers/controllers_history';
import * as controllers_markup          from './controllers/controllers_markup';
import * as controllers_media           from './controllers/controllers_media';
import * as controllers_migration       from './controllers/controllers_migration';
import * as controllers_mode            from './controllers/controllers_mode';
import * as controllers_onboarding      from './controllers/controllers_onboarding';
import * as controllers_selection       from './controllers/controllers_selection';
import * as controllers_serialize       from './controllers/controllers_serialize';
import * as controllers_thumbnail       from './controllers/controllers_thumbnail';
import * as controllers_url             from './controllers/controllers_url';

const controllers = {
    controllers_api,
    controllers_blocks,
    controllers_capabilities,
    controllers_contrast,
    controllers_deckImport,
    controllers_grid,
    controllers_guides,
    controllers_history,
    controllers_markup,
    controllers_media,
    controllers_migration,
    controllers_mode,
    controllers_onboarding,
    controllers_selection,
    controllers_serialize,
    controllers_thumbnail,
    controllers_url
};

module.exports = controllers;
