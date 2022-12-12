import React, {useEffect} from 'react';
import classNames from 'classnames';
import Measure from 'react-measure';

import {RootProviders} from './RootProviders';
import {useEntryStateDispatch, useSection} from '../entryState';
import {Section} from './Section';
import {FullscreenDimensionProvider} from './Fullscreen';
import {StaticPreview} from './useScrollPositionLifecycle';

import contentStyles from './Content.module.css';
import styles from './SectionThumbnail.module.css';

export function StandaloneSectionThumbnail({seed, ...props}) {
  return (
    <RootProviders seed={seed}>
      <SectionThumbnail {...props} />
    </RootProviders>
  );
}

export function SectionThumbnail({sectionPermaId, subscribe, scale}) {
  const dispatch = useEntryStateDispatch();

  useEffect(() => {
    if (subscribe) {
      return subscribe(dispatch);
    }
  }, [subscribe, dispatch])

  const section = useSection({sectionPermaId});
  const scaleFactor = scale ? 5 : 1;

  if (section) {
    return (
      <StaticPreview>
        <Measure client>
          {({measureRef, contentRect}) =>
            <FullscreenDimensionProvider {...clientDimensions(contentRect, scaleFactor)}>
              <div ref={measureRef} className={styles.crop} inert="">
                <div className={classNames({[styles.scale]: scale})}>
                  <div className={contentStyles.Content}
                       style={viewportUnitCustomProperties(
                         clientDimensions(contentRect, scaleFactor)
                       )}>
                    <Section state="active"
                             domIdPrefix="section-preview"
                             section={{...section, transition: 'preview'}} />
                  </div>
                </div>
              </div>
            </FullscreenDimensionProvider>
          }
        </Measure>
      </StaticPreview>
    );
  }
  else {
    return (
      <div className={styles.root}>
        Not found.
      </div>
    );
  }
}

SectionThumbnail.defaultProps = {
  scale: true,
  subscribe: () => {}
}

function clientDimensions(contentRect, scaleFactor) {
  return {
    width: contentRect.client.width &&
           Math.ceil(contentRect.client.width * scaleFactor),
    height: contentRect.client.height &&
            Math.ceil(contentRect.client.height * scaleFactor)
  }
}
function viewportUnitCustomProperties({width, height}) {
  return {
    '--vw': width && `${width / 100}px`,
    '--vh': height && `${height / 100}px`
  }
}
