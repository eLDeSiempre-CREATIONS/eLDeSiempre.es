import { initPage } from '../core/page.js';
import { initContact } from '../contact/contact.js';

initPage({ page: 'contacto', onReady: initContact });
