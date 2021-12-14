import {
  beforeBreadcrumbHook,
  BreadcrumbApi,
  BreadcrumbItem,
  BreadcrumbOpts
} from "@doras/types";

export class Breadcrumb implements BreadcrumbApi {
  private readonly maxBreadcrumbs: number;
  private readonly beforeBreadcrumb: beforeBreadcrumbHook;
  private readonly breadcrumbs: BreadcrumbItem[];

  constructor(options: BreadcrumbOpts) {
    this.maxBreadcrumbs = options.maxBreadcrumbs;
    this.beforeBreadcrumb = options.beforeBreadcrumb;
    this.breadcrumbs = [];
  }

  add(data: BreadcrumbItem) {
    let item = data;
    item.timestamp = Date.now();

    if (this.beforeBreadcrumb) {
      item = this.beforeBreadcrumb(item);
      if (!item) return;
    }

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
    this.breadcrumbs.push(item);
  }

  getItems(): BreadcrumbItem[] {
    return this.breadcrumbs;
  }
}
