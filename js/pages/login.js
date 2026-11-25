import { initPage } from '../core/page.js';
import { initLogin } from '../auth/login.js';

initPage({ page: 'login', onReady: initLogin });
