var QuickBuyDrawer = class extends DrawerContent {
    
    connectedCallback() {
      
      super.connectedCallback();
      this.delegate.on("variant:changed", this._onVariantChanged.bind(this));
    }
    async _load() {
      console.log('_load');
      window.dispatchEvent(new 
        CustomEvent("swym:collections-loaded"));
      await super._load();
      this.imageElement = this.querySelector(".quick-buy-product__image");
      if (window.Shopify && window.Shopify.PaymentButton) {
        window.Shopify.PaymentButton.init();
      }
    }
    _onVariantChanged(event) {
      const variant = event.detail.variant;
      if (variant) {
        
        Array.from(this.querySelectorAll(`[href*="/products"]`)).forEach((link) => {
          const url = new URL(link.href);
          url.searchParams.set("variant", variant["id"]);
          link.setAttribute("href", url.toString());
        });
      }
      if (!this.imageElement || !variant || !variant["featured_media"]) {
        return;
      }
      const featuredMedia = variant["featured_media"];
      if (featuredMedia["alt"]) {
        this.imageElement.setAttribute("alt", featuredMedia["alt"]);
      }
      this.imageElement.setAttribute("width", featuredMedia["preview_image"]["width"]);
      this.imageElement.setAttribute("height", featuredMedia["preview_image"]["height"]);
      this.imageElement.setAttribute("src", getSizedMediaUrl(featuredMedia, "342x"));
      this.imageElement.setAttribute("srcset", getMediaSrcset(featuredMedia, [114, 228, 342]));
    }
  };
  window.customElements.define("quick-buy-drawer", QuickBuyDrawer);
