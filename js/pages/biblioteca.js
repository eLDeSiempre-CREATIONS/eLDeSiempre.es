import { initPage } from '../core/page.js';
import { initLibraryRouter } from '../library/router.js';
import { initVotes } from '../library/votes.js';

initPage({
  page: 'biblioteca',
  requireAuth: true,
  onReady: () => {
    initVotes();
    initLibraryRouter();
  },
});
