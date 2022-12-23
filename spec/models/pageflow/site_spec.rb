require 'spec_helper'

module Pageflow
  describe Site do
    describe '#display_name' do
      it 'uses placeholder' do
        site = build(:site)

        expect(site.display_name).to eq('(Default)')
      end

      it 'uses placeholder' do
        site = build(:site, name: 'Some site')

        expect(site.display_name).to eq('Some site')
      end
    end

    describe '#name_with_account_prefix' do
      it 'defaults to account name' do
        account = build(:account, name: 'Some Account')
        site = build(:site, account: account)

        expect(site.name_with_account_prefix).to eq('Some Account')
      end

      it 'includes site name as suffix' do
        account = build(:account, name: 'Some Account')
        site = build(:site, account: account, name: 'Some Campaign')

        expect(site.name_with_account_prefix).to eq('Some Account - Some Campaign')
      end
    end

    describe '#host' do
      it 'returns host based on public_entry_url_options' do
        Pageflow.config.public_entry_url_options = lambda do |site|
          {host: "#{site.name}.example.com"}
        end

        site = build(:site, name: 'some')

        expect(site.host).to eq('some.example.com')
      end
    end

    describe '#cname_domain' do
      it 'removes subdomain' do
        site = build(:site, :cname => 'foo.bar.com')

        expect(site.cname_domain).to eq('bar.com')
      end

      it 'removes multiple subdomain' do
        site = build(:site, :cname => 'foo.bar.baz.com')

        expect(site.cname_domain).to eq('baz.com')
      end

      it 'does not change anything if no subdomain is present' do
        site = build(:site, :cname => 'foo.org')

        expect(site.cname_domain).to eq('foo.org')
      end

      it 'does not change bogus' do
        site = build(:site, :cname => 'localhost')

        expect(site.cname_domain).to eq('localhost')
      end

      it 'is empty if cname is empty' do
        site = build(:site, :cname => '')

        expect(site.cname_domain).to eq('')
      end
    end

    describe '.with_home_url' do
      it 'includes site with home_url' do
        site = create(:site, home_url: 'http://home.example.com')

        expect(Site.with_home_url).to include(site)
      end

      it 'does not include site with blank home_url' do
        site = create(:site, home_url: '')

        expect(Site.with_home_url).not_to include(site)
      end
    end

    describe '.for_request' do
      it 'uses Pageflow.config.site_request_scope' do
        Pageflow.config.site_request_scope = lambda do |sites, request|
          sites.where(cname: request.subdomain)
        end
        matching_site = create(:site, cname: 'matching')
        other_site = create(:site, cname: 'other')
        request = double('Request', subdomain: 'matching')

        result = Site.for_request(request)

        expect(result).to eq([matching_site])
      end
    end
  end
end
