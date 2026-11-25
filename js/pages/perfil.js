import { initPage } from '../core/page.js';
import { initProfile } from '../profile/profile.js';

initPage({ page: 'perfil', requireAuth: true, onReady: initProfile });
