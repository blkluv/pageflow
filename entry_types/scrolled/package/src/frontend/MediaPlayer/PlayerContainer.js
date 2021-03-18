import React, {useEffect, useRef} from 'react';
import {media} from 'pageflow/frontend';
import {useAtmo} from '../useAtmo';

import './videojsBase.module.css';

function PlayerContainer({
  filePermaId, sources, textTrackSources, type,
  playsInline, loop, controls, altText,
  mediaEventsContextData, atmoDuringPlayback, onSetup, onDispose
}){
  const playerWrapperRef = useRef(null);
  let atmo = useAtmo();

  useEffect(() => {
    let playerWrapper = playerWrapperRef.current;

    if (sources) {
      let player = media.getPlayer(sources, {
        textTrackSources,
        filePermaId,
        tagName: type,
        playsInline: playsInline,
        loop: loop,
        controls: controls,
        hooks: atmoDuringPlayback ? atmo.createMediaPlayerHooks(atmoDuringPlayback) : {}, //create hooks only for inline media players
        mediaEventsContextData,
        altText,

        onRelease() {
          playerWrapper.removeChild(player.el());
          player = null;

          if (onDispose) {
            onDispose();
          }
        }
      });
      playerWrapper.appendChild(player.el());

      if (onSetup) {
        onSetup(player);
      }

      return () => {
        // onRelease might already have been called by the pool when
        // it needed to re-use a player.
        if (player) {
          media.releasePlayer(player);
        }
      }
    }
  });

  return (
    <div ref={playerWrapperRef}>
    </div>
  );
}

PlayerContainer.defaultProps = {
  textTrackSources: []
};

// This function assumes that that the parameters are arrays of
// objects containing only skalar values. It is not a full deep
// equality check, but  suffices for the use case.
function deepEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    let aItem = a[i];
    let bItem = b[i];

    if (Object.keys(aItem).length !== Object.keys(bItem).length) {
      return false;
    }

    for (let key in aItem) {
      if (aItem[key] !== bItem[key]) {
        return false;
      }
    }
  }

  return true;
}


function areEqual(prevProps, nextProps) {
  return prevProps.type === nextProps.type &&
         prevProps.playsInline === nextProps.playsInline &&
         prevProps.loop === nextProps.loop &&
         prevProps.controls === nextProps.controls &&
         prevProps.altText === nextProps.altText &&
         prevProps.atmoDuringPlayback === nextProps.atmoDuringPlayback &&
         deepEqual(prevProps.sources, nextProps.sources) &&
         deepEqual(prevProps.textTrackSources, nextProps.textTrackSources);
}

export default React.memo(PlayerContainer, areEqual);
