import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ContextMenuComponent } from '@volosoft/ngx-lepton-x/lib/components/context-menu/context-menu.component';
import { RightBarService } from '../../services/right-bar.service';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Observable, Subscription } from 'rxjs';
import { ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { LinkCategoryService, LinkService } from '@apis/general/links';
import { LinkViewDto, LinkGetListInput, LinkCategoryDto } from '@apis/general/links/dtos';

interface Links {
  name: string;
  displayName: string;
  url: string;
  icon: string;
  children: Links[];
}

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "LinksComponent"
    }
  ]
})
export class LinksComponent implements OnInit {
  links = [
    // {
    //   name: 'Support',
    //   displayName: 'Support',
    //   url: '/home',
    //   icon: 'fa fa-support',
    //   children: [
    //     {
    //       name: 'Help',
    //       displayName: 'Report Bug',
    //       url: 'https://kochprod.service-now.com/compass?id=sc_cat_item&table=sc_cat_item&sys_id=22d3529c47696dd08430878a436d4355',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'MOS & Fusion Support',
    //       url: 'https://kochprod.service-now.com/compass?id=sc_cat_item&table=sc_cat_item&sys_id=c3685382977da5140dc9f52f2153afb0',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'Request  Enhancement',
    //       url: 'https://kochprod.service-now.com/compass?id=sc_cat_item&table=sc_cat_item&sys_id=5d515733878d651017c784c7cebb3574',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'EBX',
    //       url: 'https://kochprod.service-now.com/compass?id=sc_cat_item&table=sc_cat_item&sys_id=22d3529c47696dd08430878a436d4355',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'EBX & Mevisio',
    //       url: 'https://koch.link/ebx',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'Release Notes',
    //       url: 'https://kochind.sharepoint.com/:w:/s/UFE/EVy-zHtsUxhLphjDSKChj3wB1u7NLlZIFOyh7N4pX_ikTA?e=cxOoFM',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'User Guide',
    //       url: 'https://kochind.sharepoint.com/:b:/s/UFE/ETuQnFiqSWVHl8iQDmfbodkBVlolsvqaObJkI-LnuV4zxg?e=aSte06',
    //       icon: 'help',
    //       children: [],
    //     },
    //   ],
    // },
    // {
    //   name: 'Reports',
    //   displayName: 'Reports',
    //   url: '/about',
    //   icon: 'fa fa-table',
    //   children: [
    //     {
    //       name: 'Help',
    //       displayName: 'Daily Management Analytics',
    //       url: 'https://app.powerbi.com/groups/me/reports/31dac289-b863-407c-b022-3f65e65263c6/ReportSectiona4ba72518234f056590f?ctid=101ce67d-13f2-447a-bb65-0989b89dfdb4&experience=power-bi',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'Mevisio History',
    //       url: 'https://app.powerbi.com/groups/me/reports/6e4fc061-73c4-4cdd-bffd-a8c7e218997c/ReportSection915187054c08cc6511ed?ctid=101ce67d-13f2-447a-bb65-0989b89dfdb4&experience=power-bi',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'MOS Dashboard',
    //       url: 'https://app.powerbi.com/groups/me/reports/1af9594c-1e51-4fe8-a97a-129b3dffb207/ReportSection8593379f1053238c040b?ctid=101ce67d-13f2-447a-bb65-0989b89dfdb4&experience=power-bi',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'M&O KPIs Dashboard',
    //       url: 'https://app.powerbi.com/groups/me/apps/3dd0717a-adf2-42ec-a76b-1737749a072b/reports/2b2723e9-2b50-4729-9eaf-ceedb09fab17/ReportSection?ctid=101ce67d-13f2-447a-bb65-0989b89dfdb4&experience=power-bi',
    //       icon: 'help',
    //       children: [],
    //     },
    //   ],
    // },
    // {
    //   name: 'Training',
    //   displayName: 'Training',
    //   url: '/contact',
    //   icon: 'fa fa-book',
    //   children: [
    //     {
    //       name: 'Help',
    //       displayName: 'Formula Details',
    //       url: 'https://kochind.sharepoint.com/:x:/r/sites/MOSDigitalEnablers/_layouts/15/Doc.aspx?sourcedoc=%7B53407C71-B5CA-4AAF-8D60-88B1DC6F7A62%7D&file=Mevisio%20Formulas.xlsx&action=default&mobileredirect=true',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'Cell Visualization',
    //       url: 'https://kochind.sharepoint.com/sites/MOSDigitalEnablers/Shared Documents/Forms/AllItems.aspx?csf=1&web=1&e=EiMFkk&cid=54699922%2D0aeb%2D4e17%2D8dec%2Da5e34c2c621f&RootFolder=%2Fsites%2FMOSDigitalEnablers%2FShared%20Documents%2FMevisio%2FCell%20Visualization&FolderCTID=0x012000941164AD1C67AB4FBE3DDF7191BE5D2A',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'Area Visualization',
    //       url: 'https://kochind.sharepoint.com/sites/MOSDigitalEnablers/Shared Documents/Forms/AllItems.aspx?csf=1&web=1&e=kYnUAf&cid=4c73adb0%2D95f6%2D4f7e%2Db468%2Db82e6e4900f6&RootFolder=%2Fsites%2FMOSDigitalEnablers%2FShared%20Documents%2FMevisio%2FArea%20Visualization&FolderCTID=0x012000941164AD1C67AB4FBE3DDF7191BE5D2A',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'Admin',
    //       url: 'https://kochind.sharepoint.com/sites/MOSDigitalEnablers/Shared Documents/Forms/AllItems.aspx?csf=1&web=1&e=zqROJF&cid=d6446bd9%2Dc724%2D4cb0%2D82cc%2D1be85a1dba85&RootFolder=%2Fsites%2FMOSDigitalEnablers%2FShared%20Documents%2FMevisio%2FAdmin&FolderCTID=0x012000941164AD1C67AB4FBE3DDF7191BE5D2A',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'Site Visualization',
    //       url: 'https://kochind.sharepoint.com/sites/MOSDigitalEnablers/Shared Documents/Forms/AllItems.aspx?csf=1&web=1&e=kYnUAf&cid=cc3b0c34%2D6c29%2D436b%2D927f%2D7c403c3463fb&RootFolder=%2Fsites%2FMOSDigitalEnablers%2FShared%20Documents%2FMevisio%2FSite%20Visualization&FolderCTID=0x012000941164AD1C67AB4FBE3DDF7191BE5D2A',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'EBX',
    //       url: 'https://kochind.sharepoint.com/:w:/r/sites/MOSDigitalEnablers/_layouts/15/Doc.aspx?sourcedoc=%7B33BEE7FC-8487-48DE-90B4-E09E196EA9D9%7D&file=MOS%20EBX%20User%20Guide%20Ver%201.docx&action=default&mobileredirect=true',
    //       icon: 'help',
    //       children: [],
    //     },
    //   ],
    // },
    // {
    //   name: 'OtherTools',
    //   displayName: 'Other Tools',
    //   url: '/services',
    //   icon: 'fa fa-wrench',
    //   children: [
    //     {
    //       name: 'Help',
    //       displayName: 'I-Nexus',
    //       url: 'https://molex.i-nexus.com/',
    //       icon: 'help',
    //       children: [],
    //     },
    //     {
    //       name: 'Help',
    //       displayName: 'MOS Home Page',
    //       url: 'https://kochind.sharepoint.com/sites/MLX_MOS',
    //       icon: 'help',
    //       children: [],
    //     },
    //   ],
    // }
  ];
  linksData: LinkViewDto[];
  @ViewChild('menu') menu: ContextMenuComponent;
  isOpen: boolean = false;
  totalMessages: number = 5;
  isModalVisible = false;
  data: PagedResultDto<LinkViewDto> = { totalCount: 0, items: [] };
  searchKeyword = '';
  subscription: Subscription;
  isActive = false;

  constructor(private eRef: ElementRef,
    private linkService: LinkService,
    private route: Router,
    private rightBarService: RightBarService,
    public list: ListService<LinkGetListInput>,
    private service: LinkService,
    public linkCategoryservice: LinkCategoryService,
    private toasterService: ToasterService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.getLinks();
    this.rightBarService.refreshData.subscribe(info => {
      if (info === 'refresh') {
        this.getUserFavoritesLinks();
      }
    });
  }

  getUserFavoritesLinks() {
    this.linkService.getUserFavorites({ skipHandleError: true }).subscribe(res => {
      if (this.links.find(item => item.name === 'Favorites')) {
        this.links = this.links.filter(item => item.name !== 'Favorites');
      }
      if (res.length > 0) {
        let favoriteLinks = {
          name: 'Favorites',
          displayName: 'Favorites',
          children: []
        }
        res.forEach(item => {
          favoriteLinks.children.push(
            {
              name: item.name,
              displayName: item.displayName,
              url: item.url,
              id: item.id
            }
          )
        });
        favoriteLinks.children.sort((a, b) => a.displayName.localeCompare(b.displayName));
        this.links.unshift(favoriteLinks);
      }
    });
  }

  getLinks() {
    this.linkCategoryservice.getList({ maxResultCount: 1000 }, { skipHandleError: true }).subscribe(data => {
      const linkCategories = data.items;
      this.linkService.getLinksViewList({ maxResultCount: 1000 }, { skipHandleError: true }).subscribe(res => {
        this.linksData = res.items;
        this.editLinksDataTree(linkCategories);
        this.getUserFavoritesLinks();
      });
    });
  }

  editLinksDataTree(linkCategories: LinkCategoryDto[]) {
    let linkMap = new Map();
    this.linksData.forEach(item => {
      const link = [{
        name: item.name,
        displayName: item.displayName,
        url: item.url,
        id: item.id,
        isFavorite: item.isFavorite
      }]
      if (!linkMap.has(item.linkCategoryId)) {
        linkMap.set(item.linkCategoryId, {
          name: item.linkCategoryName.replace(' ', ''),
          displayName: item.linkCategoryName,
          children: link
        })
      } else {
        linkMap.get(item.linkCategoryId).children.push(...link)
      }
    });

    linkMap.forEach((value, key) => {
      value.children.sort((a, b) => a.displayName.localeCompare(b.displayName));
    });

    linkCategories.forEach(item => {
      if (linkMap.get(item.id))
        linkMap.get(item.id).sequence = item?.sequence ?? 0;
    });

    this.links = Array.from(linkMap.values());
    this.links.sort((a, b) => a.sequence - b.sequence);
  }

  goToLinksWidget() {
    this.hookToQuery();
    this.show();
  }

  hookToQuery() {
    this.isModalVisible = true;
    this.list.hookToQuery(query => {
      return this.service.getLinksViewListWithoutFilterTargetRole({
        ...query,
        keyword: this.searchKeyword,
      })
    }).subscribe(res => {
      this.data = this.sortByFavoriteAndDisplayName(res);
    });
  }

  sortByFavoriteAndDisplayName(data: PagedResultDto<LinkViewDto>): PagedResultDto<LinkViewDto> {
    const favoriteItems = data.items.filter(item => item.isFavorite);
    const nonFavoriteItems = data.items.filter(item => !item.isFavorite);

    favoriteItems.sort((a, b) => {
      const nameA = a.displayName.toLowerCase();
      const nameB = b.displayName.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    nonFavoriteItems.sort((a, b) => {
      const nameA = a.displayName.toLowerCase();
      const nameB = b.displayName.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    data.items = [...favoriteItems, ...nonFavoriteItems];
    return data;
  }

  addOrRemoveFavorite(id, type) {
    const request: Observable<any> = type ? this.service.deleteFromFavoriteByLinkId(id) : this.service.addAsFavoriteByLinkId(id)
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = request.subscribe(res => {
      this.toasterService.success('AbpSettingManagement::SuccessfullySaved');
      this.list.get();
      this.getLinks();
    })
  }

  getTargetReaders(role) {
    let targetRaders = '';
    role.forEach((item, index) =>
      index === 0 ? targetRaders = item.roleName : targetRaders += ', ' + item.roleName
    );
    return targetRaders;
  }

show() {
    this.isActive = !this.isActive;
    this.toggleMenu();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.menu.open();
    } else {
      this.menu.close();
      this.searchKeyword = '';
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.menu.close();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isActive = false;
      this.renderer.removeClass(this.el.nativeElement, 'active');
      if (this.isOpen) {
        this.toggleMenu();
      }
    }
  }
}


