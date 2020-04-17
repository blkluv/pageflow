import Marionette from 'backbone.marionette';

export const SideBarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/chapters/:id': 'chapter',
    'scrolled/sections/:id': 'section',
    'scrolled/content_elements/insert?position=:position&id=:id': 'insertContentElement',
    'scrolled/content_elements/:id': 'contentElement'
  }
});