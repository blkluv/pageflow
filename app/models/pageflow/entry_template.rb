module Pageflow
  class EntryTemplate < ApplicationRecord
    include ThemeReferencer
    include SerializedConfiguration
    serialize :default_share_providers, JSON
    belongs_to :account
    has_many :widgets, as: :subject, dependent: :destroy

    validates :account, presence: true

    def resolve_widgets(options = {})
      widgets.resolve(Pageflow.config_for(account), options)
    end

    def copy_defaults_to(revision)
      widgets.copy_all_to(revision)
      copy_attributes_to(revision)
    end

    def share_providers=(share_providers_array)
      self.default_share_providers = hashify_provider_array(share_providers_array)
    end

    def share_providers
      default_share_providers.to_a
    end

    def default_share_providers
      self[:default_share_providers].presence ||
        hashify_provider_array(Pageflow.config.default_share_providers)
    end

    private

    def copy_attributes_to(revision)
      revision.update(
        author: default_author.presence || Pageflow.config.default_author_meta_tag,
        publisher: default_publisher.presence || Pageflow.config.default_publisher_meta_tag,
        keywords: default_keywords.presence || Pageflow.config.default_keywords_meta_tag,
        share_providers: default_share_providers,
        theme_name: theme_name,
        configuration: configuration,
        locale: default_locale
      )
    end

    def available_themes
      Pageflow.config_for(account).themes
    end

    def hashify_provider_array(arr)
      Hash[arr.reject(&:blank?).map { |v| [v.to_s, true] }]
    end
  end
end
