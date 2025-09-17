import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss'
})
export class TreeViewComponent implements AfterViewInit {
  @ViewChildren('checkbox') checkboxs: QueryList<ElementRef>;
  @Input() nodes: any[] = [];
  @Input() parent?: any;
  @Input() hasDefault?: boolean = false;
  @Input() hideCheckbox?: boolean = false;
  @Input() enforceDisabledCheck: boolean = true; 

  @Output() checkChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() defaultChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private render: Renderer2, public element: ElementRef) {}

  ngAfterViewInit(): void {
    this.makeDefaultDataTierExpand(this.nodes);
    this.updateTreeNodes(this.nodes);
  }

  makeDefaultDataTierExpand(nodes: any) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].children && nodes[i].children.find(child => child.isDefault)) {
        nodes[i].expanded = true;
        return nodes[i];
      } else {
        if (nodes[i].children && this.makeDefaultDataTierExpand(nodes[i].children)?.expanded) {
          nodes[i].expanded = true;
        }
      }
    }
  }

  initIndeterminateState() {
    this.nodes.forEach((node, idx) => {
      if (this.checkboxs) {
        let element = this.checkboxs.toArray()[idx];
        if (element) {
          if (node.indeterminate) {
            this.setIndeterminateState(element, true);
          } else {
            this.setIndeterminateState(element, false);
          }
        }
      }
    })
  }
  // for init, parent impact child state, for state change from children, child impact parent  -- 2024-08-01
  // parent should not impact child state, such as when parent is checked, when add new child from modeling page,
  // new added child should not be checked by default  -- 2025-03-26
  updateTreeNodes(nodes) {
    nodes.forEach((node, idx) => {
      if (node.children && node.children.length > 0) {
        // if parent checked, all child checked
        // if (node.checked && !fromChildren) {
        //   this.checkAllChildren(node.children);
        // }
        this.updateTreeNodes(node.children);
        const allChildrenChecked = node.children.every(child => child.checked);
        const someChildrenChecked = node.children.some(child => child.checked || child.indeterminate);

        node.checked = allChildrenChecked;
        node.indeterminate = !allChildrenChecked && someChildrenChecked;
        
        if (!node.checked && node.isDefault) {
          node.isDefault = false;
          this.defaultChange.emit({ defaultDataTierType: '', defaultDataTierId: '' });
        }
      }
    });
    this.initIndeterminateState();
  }

  checkAllChildren(children) {
    children.forEach((child) => {
      child.checked = true;
      child.indeterminate = false; // Reset indeterminate state
      if (child.children && child.children.length > 0) {
        this.checkAllChildren(child.children);
      }
    });
  }

  setIndeterminateState(element, indeterminate = false) {
    this.render.setProperty(element.nativeElement, 'indeterminate', indeterminate);
  }

  toggleCheckbox(element, node: any) {
    delete node.indeterminate;
    this.setIndeterminateState(element);
    node.checked = !node.checked;
    if (!node.checked && node.isDefault) {
      node.isDefault = false;
      this.defaultChange.emit({ defaultDataTierType: '', defaultDataTierId: '' });
    }
    if (node.children) {
      this.checkUncheckChildren(node.children, node.checked);
    }
    if (this.parent) {
      this.checkChange.emit();
    }
    if (this.enforceDisabledCheck && node.checked && node.children) {
      node.children.forEach(child => {
        if (child.disabled) child.checked = false;
      });
    }
  }

  toggleDefault(node: any) {
    this.clearDefault(this.nodes, { defaultDataTierType: node.type, defaultDataTierId: node.id });
    node.isDefault = true;
    this.defaultChange.emit({ defaultDataTierType: node.type, defaultDataTierId: node.id });
  }

  clearDefault(nodes: any[], defaultDataTier = { defaultDataTierType: '', defaultDataTierId: '' }) {
    nodes.forEach(node => {
      if (node.type === defaultDataTier.defaultDataTierType && node.id === defaultDataTier.defaultDataTierId) {
        node.isDefault = true;
      } else {
        node.isDefault = false;
      }
      if (node.children) {
        this.clearDefault(node.children, defaultDataTier);
      }
    });
    this.nodes = [...this.nodes]
  }

  checkUncheckChildren(nodes: any[], checked: boolean) {
    nodes.forEach(node => {
      node.checked = checked;
      if (!node.checked && node.isDefault) {
        node.isDefault = false;
        this.defaultChange.emit({ defaultDataTierType: '', defaultDataTierId: '' });
      }
      if (node.children) {
        this.checkUncheckChildren(node.children, checked);
      }
    });
  }

  toggleExpand(node: any) {
    node.expanded = !node.expanded;
  }

  refreshState() {
    this.updateTreeNodes(this.nodes);
    if (this.parent) {
      this.checkChange.emit();
    }
  }

  hasCheckedChildren(nodes: any[]): boolean {
    return nodes.some(node => node.checked || (node.children && this.hasCheckedChildren(node.children)));
  }

  defaultDataTierChange(event) {
    this.clearDefault(this.nodes, { defaultDataTierType: event.defaultDataTierType, defaultDataTierId: event.defaultDataTierId });
    this.defaultChange.emit(event)
  }
}
