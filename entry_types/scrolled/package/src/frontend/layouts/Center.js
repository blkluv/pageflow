import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';

import {widthName} from './widthName';

import styles from './Center.module.css';

const availablePositions = ['inline', 'left', 'right'];
const floatedPositions = ['left', 'right'];

const legacyPositionWidths = {
  wide: 'xl',
  full: 'full'
};

export function Center(props) {

  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />
      {props.items.map((item, index) => {
        const customMargin = hasCustomMargin(item);
        const position = getPosition(item);
        const width = getWidth(item);

        return (
          <ContentElements key={item.id} sectionProps={props.sectionProps} items={[item]} customMargin={customMargin}>
            {(item, child) =>
              <div key={item.id} className={outerClassName(props.items, index)}>
                <div className={classNames(styles.item,
                                           styles[`item-${position}-${width}`])}>
                  {props.children(
                    <div className={classNames(styles[`inner-${item.position}`],
                                               styles[`inner-${width}`])}>
                      {child}
                    </div>,
                    boxProps(props.items, item, index)
                  )}
                </div>
              </div>
            }
          </ContentElements>
        );
      })}
      {renderPlaceholder(props.placeholder)}
    </div>
  );
}

function outerClassName(items, index) {
  const item = items[index];

  return classNames(
    styles.outer,
    styles[`outer-${getWidth(item)}`],
    {[styles.customMargin]: hasCustomMargin(item)},
    {[styles.clear]: clearItem(items, index)}
  );
}

function boxProps(items, item, index) {
  const previous = items[index - 1];
  const next = items[index + 1];
  const customMargin = hasCustomMargin(item);

  return {
    position: item.position,
    customMargin,
    selfClear: selfClear(items, index),
    openStart: previous &&
               !customMargin &&
               !hasCustomMargin(previous) &&
               item.position !== 'full' && previous.position !== 'full' &&
               item.position !== 'wide' && previous.position !== 'wide',
    openEnd: next &&
             !customMargin &&
             !hasCustomMargin(next) &&
             item.position !== 'full' && next.position !== 'full' &&
             item.position !== 'wide' && next.position !== 'wide',
  }
}

function selfClear(items, index) {
  const item = items[index];
  const next = items[index + 1];

  if (supportsWrappingAroundFloats(item) ||
      (isFloated(item) && (!next || clearItem(items, index + 1)))) {
    return 'both';
  }
  else if (isFloated(item)) {
    return item.position === 'left' ? 'right' : 'left';
  }

  return 'none';
}

function clearItem(items, index) {
  return supportsWrappingAroundFloats(items[index]) ?
         followsSideBySideElements(items, index) :
         !isFloatedFollowingOppositeFloated(items, index)
}

function followsSideBySideElements(items, index) {
  return index > 1 && (
    (items[index - 1].position === 'left' && items[index - 2].position === 'right') ||
    (items[index - 1].position === 'right' && items[index - 2].position === 'left')
  );
}

function isFloatedFollowingOppositeFloated(items, index) {
  return index > 0 &&
         isFloated(items[index]) &&
         isFloated(items[index - 1]) &&
         items[index].position !== items[index - 1].position;
}

function isFloated(item) {
  return floatedPositions.includes(item.position);
}

function supportsWrappingAroundFloats(item) {
  const {supportsWrappingAroundFloats} = api.contentElementTypes.getOptions(item.type);
  return supportsWrappingAroundFloats;
}

function hasCustomMargin(item) {
  const position = getPosition(item);
  const {customMargin: elementSupportsCustomMargin} = api.contentElementTypes.getOptions(item.type) || {};
  return !!elementSupportsCustomMargin && (position === 'inline' || position === 'wide');
}

function getPosition(item) {
  return availablePositions.includes(item.position) ? item.position : 'inline';
}

function getWidth(item) {
  return legacyPositionWidths[item.position] ||
         widthName(clampWidthByPosition(item));
}

function clampWidthByPosition(item) {
  if (['left', 'right'].includes(item.position)) {
    return Math.min(Math.max(item.props?.width, -2), 2);
  }
  else {
    return item.props?.width;
  }
}

function renderPlaceholder(placeholder) {
  if (!placeholder) {
    return null;
  }

  return (
    <div className={classNames(styles.outer)}>
      <div className={classNames(styles.item)}>
        {placeholder}
      </div>
    </div>
  )
}
