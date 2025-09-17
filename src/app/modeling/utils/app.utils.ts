import { FileType } from './file-type.enum';
const treeNodeChildMap = { Area: 'cells', Cell: 'workCenters' };

export class AppUtils {
  static getFileSuffix(fileType: FileType) {
    let suffix = '';
    switch (fileType) {
      case 0:
        suffix = 'json';
        break;
      case 1:
        suffix = 'xlsx';
        break;
      // case 2:
      //   suffix = 'csv';
      //   break;
      default:
        suffix = 'json';
        break;
    }
    return suffix;
  }

  static getLocalDate(date: string) {
    // time string from server based on +00:00, convert to local time
    return date ? new Date(date + '+00:00') : date;
  }

  static generatePassword(length = 8) {
    const numbers = '0123456789';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allCharacters = numbers + lowerCase + upperCase + symbols;
    const getRandomCharacter = (characters: string) =>
      characters[Math.floor(Math.random() * characters.length)];

    let password = '';
    password += getRandomCharacter(numbers);
    password += getRandomCharacter(lowerCase);
    password += getRandomCharacter(upperCase);
    password += getRandomCharacter(symbols);

    // Fill the rest of the password length
    for (let i = password.length; i < length; i++) {
      password += getRandomCharacter(allCharacters);
    }

    // Shuffle the password to ensure randomness
    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return password;
  }

  /**
   *
   * @param objectType
   * @param type
   * @returns objectType-yyyy-mm-dd-hh-mm-ss.suffix(json/xlsx/csv)
   */
  static generateFileName(objectType: string, type: FileType) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    const suffix = AppUtils.getFileSuffix(type);
    return `${objectType}_${year}-${month}-${day}_${hour}-${minute}-${second}.${suffix}`;
  }

  static convertMenuData(input: any[]): any[] {
    const headers = input[0];
    const result: any[] = [];
    const parentItemsMap: { [key: string]: any } = {};

    // find key by value
    const getKeyByValue = (type: string, value: string): string => {
      return Object.keys(headers).find(key => headers[key] === value && key.includes(type)) || '';
    };

    // Define a function to map MenuType strings to integers
    const mapMenuType = (type: string): number | null => {
      switch (type) {
        case 'Menu':
          return 0;
        case 'MenuItem':
          return 1;
        case 'SubMenu':
          return 2;
        default:
          return null;
      }
    };

    // Function to create a menu item
    const createMenuItem = (item: any, type: string): any => {
      return {
        Path: item[getKeyByValue(type, 'Path')],
        Order: parseInt(item[getKeyByValue(type, 'Order')], 10),
        IconClass: item[getKeyByValue(type, 'IconClass')],
        MenuType: mapMenuType(item[getKeyByValue(type, 'MenuType')]),
        SubMenuName: item[getKeyByValue(type, 'SubMenuName')] || null,
        Layout: item[getKeyByValue(type, 'Layout')],
        Name: item[getKeyByValue(type, 'Name')],
        Description: item[getKeyByValue(type, 'Description')],
        DisplayName: item[getKeyByValue(type, 'DisplayName')],
        Children: [],
      };
    };

    // Iterate over the input data, ignoring the first item (headers)
    for (let i = 1; i < input.length; i++) {
      const item = input[i];

      if (!item.Items) {
        // Top-level Parent item
        const parent = createMenuItem(item, 'EMPTY');
        parentItemsMap[item[getKeyByValue('EMPTY', 'Name')]] = parent;
        result.push(parent);
      } else {
        // Child item
        const child = createMenuItem(item, 'Items');

        // Find the corresponding parent based on Name field
        const parentName = item[getKeyByValue('EMPTY', 'Name')];
        if (parentItemsMap[parentName]) {
          parentItemsMap[parentName].Children.push(child);
        } else {
          // If no parent found, create a new parent entry
          const newParent = createMenuItem(item, 'EMPTY');
          newParent.Children.push(child);
          parentItemsMap[parentName] = newParent;
          result.push(newParent);
        }
      }
    }

    return result;
  }

  static convertExcelFileImportData(data: any, objectType: string) {
    const result = [];
    let importItem: any = {};
    for (let i = 1; i < data.length; i++) {
      const currentRow = data[i];
      const previousRow = data[i - 1];

      // if Name and DisplayName same as previous item, the data shuuld be in one group.
      if (i > 1 && (currentRow.__EMPTY === previousRow.__EMPTY && currentRow.__EMPTY_1 === previousRow.__EMPTY_1)) {
        // State Models
        if (objectType === 'StateModels') {
          // FromState ToState are required fields
          if (currentRow.ExportStateTransitionItem && currentRow.ExportStateTransitionItem_1) {
            if (objectType === 'StateModels') {
              importItem['StateTransition'].push({
                FromState: currentRow.ExportStateTransitionItem,
                ToState: currentRow.ExportStateTransitionItem_1
              });
            }
          }
        }
        // User Group
        if (objectType === 'UserGroup') {
          if (currentRow.UserGroupUsersItem) {
            importItem.Users.push({
              UserName: currentRow.UserGroupUsersItem,
              UserEmail: currentRow.UserGroupUsersItem_1
            });
          }
        }

        // ShiftPatterns
        if (objectType === 'ShiftPatterns') {
          if (currentRow.ShiftPatternDetailItem && currentRow.ShiftPatternDetailItem_1) {
            importItem.ShiftPatternDetails.push({
              Shift: currentRow.ShiftPatternDetailItem,
              StartTime: currentRow.ShiftPatternDetailItem_1
            });
          }
        }

        // User Queries
        if (objectType === 'UserQueries') {
          if (currentRow.UserQueryParameterItem) {
            importItem.Parameters.push({
              Name: currentRow.UserQueryParameterItem,
              ValueType: currentRow.UserQueryParameterItem_1,
              DefaultValue: currentRow.UserQueryParameterItem_2
            });
          }
        }

      } else {
        // else will create a new group.
        if (importItem && i > 1) {
          result.push(importItem);
        }
        importItem = this.createEmptyImportObject(data[0], objectType);
        // State Models
        if (objectType === 'StateModels') {
          importItem.Name = currentRow.__EMPTY;
          importItem.DisplayName = currentRow.__EMPTY_1;
          importItem.Description = currentRow.__EMPTY_2;
          importItem.DefaultState = currentRow.__EMPTY_3;
          importItem.CreationTime = currentRow.__EMPTY_4;
          importItem.CreationUser = currentRow.__EMPTY_5;
          importItem.LastModificationTime = currentRow.__EMPTY_6;
          importItem.LastModificationUser = currentRow.__EMPTY_7;
          if (currentRow.ExportStateTransitionItem && currentRow.ExportStateTransitionItem_1) {
            importItem['StateTransition'].push({
              FromState: currentRow.ExportStateTransitionItem,
              ToState: currentRow.ExportStateTransitionItem_1
            });
          }
        }

        // User Group
        if (objectType === 'UserGroup') {
          importItem.Name = currentRow.__EMPTY;
          importItem.DisplayName = currentRow.__EMPTY_1;
          importItem.Description = currentRow.__EMPTY_2;
          importItem.CreationTime = currentRow.__EMPTY_3;
          importItem.CreationUser = currentRow.__EMPTY_4;
          importItem.LastModificationTime = currentRow.__EMPTY_5;
          importItem.LastModificationUser = currentRow.__EMPTY_6;
          if (currentRow.UserGroupUsersItem) {
            importItem.Users.push({
              UserName: currentRow.UserGroupUsersItem,
              UserEmail: currentRow.UserGroupUsersItem_1,
            });
          }
        }

        // ShiftPatterns
        if (objectType === 'ShiftPatterns') {
          importItem.Name = currentRow.__EMPTY;
          importItem.DisplayName = currentRow.__EMPTY_1;
          importItem.Description = currentRow.__EMPTY_2;
          importItem.TimeIncrement = currentRow.__EMPTY_3;
          importItem.DataTier = currentRow.__EMPTY_4;
          importItem.CreationTime = currentRow.__EMPTY_5;
          importItem.CreationUser = currentRow.__EMPTY_6;
          importItem.LastModificationTime = currentRow.__EMPTY_7;
          importItem.LastModificationUser = currentRow.__EMPTY_8;
          if (currentRow.ShiftPatternDetailItem && currentRow.ShiftPatternDetailItem_1) {
            importItem.ShiftPatternDetails.push({
              Shift: currentRow.ShiftPatternDetailItem,
              StartTime: currentRow.ShiftPatternDetailItem_1
            });
          }
        }

        // User Queries
        if (objectType === 'UserQueries') {
          importItem.Name = currentRow.__EMPTY;
          importItem.DisplayName = currentRow.__EMPTY_1;
          importItem.QueryText = currentRow.__EMPTY_2;
          importItem.CreationTime = currentRow.__EMPTY_3;
          importItem.CreationUser = currentRow.__EMPTY_4;
          importItem.LastModificationTime = currentRow.__EMPTY_5;
          importItem.LastModificationUser = currentRow.__EMPTY_6;
          if (currentRow.UserQueryParameterItem) {
            importItem.Parameters.push({
              Name: currentRow.UserQueryParameterItem,
              ValueType: currentRow.UserQueryParameterItem_1,
              DefaultValue: currentRow.UserQueryParameterItem_2
            });
          }
        }

      }
    }

    if (importItem) {
      result.push(importItem);
    }

    return result;
  }

  static createEmptyImportObject(data: any, objectType: string) {
    const importItem: { [key: string]: any } = {};

    // Create State Model empty import data object
    if (objectType === 'StateModels') {
      importItem['StateTransition'] = [];
      Object.values(data).forEach((value: string) => {
        if (!['FromState', 'ToState'].includes(value)) {
          importItem[value] = '';
        }
      });
    }

    // Create User Group empty import data object
    if (objectType === 'UserGroup') {
      importItem['Users'] = [];
      Object.values(data).forEach((value: string) => {
        if (!['UserName', 'UserEmail'].includes(value)) {
          importItem[value] = '';
        }
      });
    }

    // ShiftPatterns
    if (objectType === 'ShiftPatterns') {
      importItem['ShiftPatternDetails'] = [];
      Object.values(data).forEach((value: string) => {
        if (!['Shift', 'StartTime'].includes(value)) {
          importItem[value] = '';
        }
      });
    }

    // User Queries
    if (objectType === 'UserQueries') {
      importItem['Parameters'] = [];
      Object.values(data).forEach((value: string) => {
        if (!['Name', 'ValueType', 'DefaultValue'].includes(value)) {
          importItem[value] = '';
        }
      });
    }

    return importItem;
  }

  static initTreeData(data: any) {
    for (let item of data) {
      const children = treeNodeChildMap[item.type] || 'children';
      if (item[children] && Array.isArray(item[children])) {
        item.children = item[children];
        this.initTreeData(item.children);
      }
    }
  }

  static hasCheckedDataTier(data: any) {
    for (let item of data) {
      if (item.checked) {
        return true;
      }
      if (item.children && Array.isArray(item.children)) {
        if (this.hasCheckedDataTier(item.children)) {
          return true;
        }
      }
    }
    return false;
  }

  static getCheckedTreeData(data: any, isOnlyTopLevel?: boolean) {
    let checked = [];
    for (let item of data) {
      if (item.checked) {
        checked.push(item);
        if (isOnlyTopLevel) {
          continue; // If only top-level checked items are needed, skip children
        }
      }
      if (item.children && Array.isArray(item.children)) {
        checked = [...checked, ...this.getCheckedTreeData(item.children, isOnlyTopLevel)];
      }
    }
    return checked;
  }

  static initTreeDataState(data: any[], selected: any[], defaultDataTier?: any) {
    // for (let item of data) {
    //   if (Array.isArray(selected) && selected.find(s => s.dataTierId == item.id && s.dataTierType == item.type)) {
    //     item.checked = true;
    //     if (selected.find(s => s.dataTierId == item.id && s.dataTierType == item.type && s.isDefault)) {
    //       item['isDefault'] = true;
    //     } else {
    //       item['isDefault'] = false;
    //     }
    //   } else {
    //     item.checked = false;
    //     item['isDefault'] = false;
    //   }
    //   if (item.children && Array.isArray(item.children)) {
    //     item.expanded = false;
    //     this.initTreeDataState(item.children, selected);
    //   }
    // }
    for (let item of data) {
      const selectedItem = Array.isArray(selected)
        ? selected.find(s => s.dataTierId == item.id && s.dataTierType == item.type)
        : null;
      if (selectedItem) {
        item.checked = true;
        if (
          defaultDataTier &&
          defaultDataTier.defaultDataTierType &&
          defaultDataTier.defaultDataTierId &&
          item.type === defaultDataTier.defaultDataTierType &&
          item.id === defaultDataTier.defaultDataTierId
        ) {
          item['isDefault'] = true;
        } else {
          item['isDefault'] = false;
        }
        // 递归选中所有子节点，并设置 isDefault
        if (item.children && Array.isArray(item.children)) {
          AppUtils.checkAllChildrenWithDefault(item.children, selected, defaultDataTier);
        }
      } else {
        item.checked = false;
        item['isDefault'] = false;
        if (item.children && Array.isArray(item.children)) {
          this.initTreeDataState(item.children, selected, defaultDataTier);
        }
      }
    }
  }

  static checkAllChildrenWithDefault(children: any[], selected: any[], defaultDataTier?: any) {
    for (let child of children) {
      child.checked = true;

      // 判断是否为 default
      if (
        defaultDataTier &&
        defaultDataTier.defaultDataTierType &&
        defaultDataTier.defaultDataTierId &&
        child.type === defaultDataTier.defaultDataTierType &&
        child.id === defaultDataTier.defaultDataTierId
      ) {
        child['isDefault'] = true;
      } else {
        child['isDefault'] = false;
      }
      if (child.children && Array.isArray(child.children)) {
        AppUtils.checkAllChildrenWithDefault(child.children, selected, defaultDataTier);
      }
    }
  }

  // export API return error with Blob type, need get error from Blob
  static exportErrorHandle(response: any) {
    return response.error.text().then(text => {
      if (typeof text == 'string') {
        let errInfo = JSON.parse(text);
        return Promise.reject(errInfo);
      }
      return Promise.reject({ error: { message: 'Internal Error' } });
    });
  }

  static initHasAccessTreeNode(allData: any[], permissionData: any[]) {
    if (!Array.isArray(allData)) {
      allData = [];
    }
    const allowedIds = new Set(permissionData.map(item => item.dataTierId));
    const filterAndMarkTree = (node: any): any => {
      let newNode = { ...node };
      newNode.disabled = !allowedIds.has(node.id);

      if (node.children && Array.isArray(node.children)) {
        newNode.children = node.children.map(filterAndMarkTree);
      }

      return newNode;
    };

    const hasPermission = (node: any): boolean => {
      if (!node.disabled) return true;
      if (node.children && Array.isArray(node.children)) {
        return node.children.some(hasPermission);
      }
      return false;
    };

    const filteredTree = allData?.map(filterAndMarkTree).filter(root => hasPermission(root));

    return filteredTree;
  }

  static getAccessTreNode(data: any[]) {
    const nodes = JSON.parse(JSON.stringify(data));
    const filterNode = node => {
      // if have children
      if (node.children && Array.isArray(node.children)) {
        node.children = node.children
          .map(child => filterNode(child))
          .filter(child => child !== null);
      }

      const hasChildren = node.children && node.children.length > 0;
      if (node.disabled && !hasChildren) {
        return null;
      }

      return node;
    };

    return nodes.map(node => filterNode(node)).filter(node => node !== null);
  }
  static updateTreeDataState(data: any[], selected: any[]) {
    this.initTreeDataState(data, selected)
    for (let item of data) {
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        this.updateTreeDataState(item.children, selected);
        const allChildrenChecked = item.children.every(child => child.checked);
        const someChildrenChecked = item.children.some(child => child.checked || child.indeterminate);
        item.checked = allChildrenChecked;
        item.indeterminate = !allChildrenChecked && someChildrenChecked;
      }
    }
  }

  static getUserDisplayName(user: any) {
    if (!user) { return ''; }
    if (user.surname && user.name) {
      return `${user.surname}, ${user.name}`;
    } else if (user.name) {
      return user.name;
    } else {
      return user.userName;
    }
  }
}
