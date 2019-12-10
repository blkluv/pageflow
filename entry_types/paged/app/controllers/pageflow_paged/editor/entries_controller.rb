module PageflowPaged
  module Editor
    # @api private
    class EntriesController < ActionController::Base
      helper Pageflow::AudioFilesHelper
      helper Pageflow::BackgroundImageHelper
      helper Pageflow::EntriesHelper
      helper Pageflow::FileBackgroundImagesHelper
      helper Pageflow::FileThumbnailsHelper
      helper Pageflow::InfoBoxHelper
      helper Pageflow::NavigationBarHelper
      helper Pageflow::OverviewHelper
      helper Pageflow::PageBackgroundAssetHelper
      helper Pageflow::PagesHelper
      helper Pageflow::PageTypesHelper
      helper Pageflow::ReactServerSideRenderingHelper
      helper Pageflow::RevisionFileHelper
      helper Pageflow::SocialShareHelper
      helper Pageflow::SocialShareLinksHelper
      helper Pageflow::TextDirectionHelper
      helper Pageflow::VideoFilesHelper

      helper_method :render_to_string
    end
  end
end
