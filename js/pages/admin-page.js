import { initPage } from '../core/page.js';
import { initAdmin } from './admin.js';

initPage({ page: 'admin', manualCurtain: true, onReady: initAdmin });
