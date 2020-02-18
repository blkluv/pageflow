import {watchCollection} from '../collections';

export function watchCollections(entry, {dispatch}) {
  const {chapters, sections, contentElements, files} = entry;
  const teardownFns = [];

  teardownFns.push(watchCollection(new Backbone.Collection([entry.metadata]), {
    name: 'entries',
    attributes: ['id', {shareProviders: 'share_providers'}, {shareUrl: 'share_url'}, 'credits'],
    dispatch
  }));
  teardownFns.push(watchCollection(chapters, {
    name: 'chapters',
    attributes: ['id', 'permaId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));
  teardownFns.push(watchCollection(sections, {
    name: 'sections',
    attributes: ['id', 'permaId', 'chapterId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));
  teardownFns.push(watchCollection(contentElements, {
    name: 'contentElements',
    attributes: ['id', 'permaId', 'typeName', 'sectionId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));

  Object.keys(files).forEach(collectionName => {
    teardownFns.push(watchCollection(files[collectionName], {
      name: camelize(collectionName),
      attributes: ['id', {permaId: 'perma_id'}, 'width', 'height', 'basename', 'rights'],
      keyAttribute: 'permaId',
      includeConfiguration: true,
      dispatch
    }));
  });

  return function() {
    teardownFns.forEach(fn => fn());
  }
}

function camelize(snakeCase) {
  return snakeCase.replace(/_[a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
}
