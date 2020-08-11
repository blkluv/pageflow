import React from 'react';

import {ClassicPlayerControls, WaveformPlayerControls} from 'frontend/PlayerControls';

import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('PlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.player_controls.play': 'Play',
    'pageflow_scrolled.public.player_controls.quality': 'Quality',
    'pageflow_scrolled.public.player_controls.text_tracks': 'Text Tracks'
  });

  describe('ClassicPlayerControls', () => {
    it('supports onFocus prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<ClassicPlayerControls onFocus={listener} />);

      getByLabelText('Play').focus();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onBlur prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<ClassicPlayerControls onBlur={listener} />);

      getByLabelText('Play').focus();
      getByLabelText('Play').blur();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseEnter prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<ClassicPlayerControls onMouseEnter={listener} />);

      fireEvent.mouseEnter(getByLabelText('Play'));

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseLeave prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<ClassicPlayerControls onMouseLeave={listener} />);

      fireEvent.mouseLeave(getByLabelText('Play'));

      expect(listener).toHaveBeenCalled();
    });

    it('supports rendering and handling events for quality menu items', () => {
      const listener = jest.fn();
      const {getByTitle, getByText} = render(<ClassicPlayerControls
                                                qualityMenuItems={[
                                                  {label: '1080p', value: 'fullhd'},
                                                  {label: '720p', value: 'medium'},
                                                ]}
                                                onQualityMenuItemClick={listener} />);

      fireEvent.click(getByTitle('Quality'));
      fireEvent.click(getByText('1080p'));

      expect(listener).toHaveBeenCalledWith('fullhd');
    });

    it('supports rendering and handling events for text track menu items', () => {
      const listener = jest.fn();
      const {getByTitle, getByText} = render(<ClassicPlayerControls
                                                textTracksMenuItems={[
                                                  {label: 'German', value: 'de'},
                                                  {label: 'English', value: 'en'},
                                                ]}
                                                onTextTracksMenuItemClick={listener} />);

      fireEvent.click(getByTitle('Text Tracks'));
      fireEvent.click(getByText('English'));

      expect(listener).toHaveBeenCalledWith('en');
    });
  });

  describe('WaveformPlayerControls', () => {
    it('supports onFocus prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<WaveformPlayerControls onFocus={listener} />);

      getByLabelText('Play').focus();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onBlur prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<WaveformPlayerControls onBlur={listener} />);

      getByLabelText('Play').focus();
      getByLabelText('Play').blur();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseEnter prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<WaveformPlayerControls onMouseEnter={listener} />);

      fireEvent.mouseEnter(getByLabelText('Play'));

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseLeave prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = render(<WaveformPlayerControls onMouseLeave={listener} />);

      fireEvent.mouseLeave(getByLabelText('Play'));

      expect(listener).toHaveBeenCalled();
    });

    it('supports rendering and handling events for text track menu items', () => {
      const listener = jest.fn();
      const {getByTitle, getByText} = render(<WaveformPlayerControls
                                                textTracksMenuItems={[
                                                  {label: 'German', value: 'de'},
                                                  {label: 'English', value: 'en'},
                                                ]}
                                                onTextTracksMenuItemClick={listener} />);

      fireEvent.click(getByTitle('Text Tracks'));
      fireEvent.click(getByText('English'));

      expect(listener).toHaveBeenCalledWith('en');
    });

  })
});
