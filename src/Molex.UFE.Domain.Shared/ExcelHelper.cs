using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Molex.UFE
{
    public static class ExcelHelper<T> where T : class
    {
        private static Dictionary<string, string> exportObjectNames = new Dictionary<string, string>()
        {
            { "ExportUserMenuDto", "Items" }
        };
        private static bool HasAttribute<TAttribute>(PropertyInfo property) where TAttribute : Attribute
        {
            return property.GetCustomAttributes(true).Any(attr => attr.GetType() == typeof(TAttribute));
        }

        private static bool IsListOfT(Type type, out Type itemType)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>))
            {
                itemType = type.GetGenericArguments()[0];
                return true;
            }
            itemType = null;
            return false;
        }

        static int rowIndex = 0;
        static IWorkbook workbook;
        public static MemoryStream WriteObjectToExcelStream(List<T> entitys)
        {
            MemoryStream ms = new MemoryStream();

            workbook = new XSSFWorkbook(); // 对于.xlsx格式  
            ISheet sheet = workbook.CreateSheet("Sheet1");

            // 使用反射获取MyData的属性名作为表头  
            PropertyInfo[] properties = typeof(T).GetProperties();

            // 创建表头  
            IRow headerRow = sheet.CreateRow(1);

            AddObjectHead(headerRow, 0, typeof(T));

            // 填充数据
            rowIndex = 2;

            foreach (var item in entitys)
            {
                int gapData = 0;

                IRow row = sheet.CreateRow(rowIndex++);
                for (int colIndex = 0; colIndex < properties.Length; colIndex++)
                {
                    if (HasAttribute<JsonIgnoreAttribute>(properties[colIndex]))
                    {
                        gapData++;
                        continue;
                    }

                    var value = properties[colIndex].GetValue(item); // 获取属性值
                    if (value is string[])
                    {
                        value = string.Join(",", (string[])value);
                    }

                    if (value != null && IsListOfT(value.GetType(), out Type itemType))
                    {
                        int childColStartIndex = colIndex - gapData;
                        // 遍历 List<T> 中的每个元素
                        AddChildRecord(row, childColStartIndex, value, itemType, sheet);

                        //add child header
                        AddObjectHead(headerRow, childColStartIndex, itemType);

                        //add child head object name
                        AddChildHeadOjbectName(sheet, childColStartIndex, itemType);

                        continue;
                    }


                    if (value is Enum)
                    {
                        row.CreateCell(colIndex - gapData).SetCellValue(Convert.ToInt32(value));
                    }
                    else if (value is IConvertible && double.TryParse(value.ToString(), out double numericValue))
                    {
                        row.CreateCell(colIndex - gapData).SetCellValue(numericValue);
                    }
                    else
                    {
                        row.CreateCell(colIndex - gapData).SetCellValue(value == null ? "" : value.ToString());
                    }

                }
            }

            // 将Excel写入到MemoryStream中  
            workbook.Write(ms, true);

            // 重置MemoryStream的位置为开始  
            ms.Position = 0;

            return ms;
        }

        private static void AddChildHeadOjbectName(ISheet sheet, int childColStartIndex, Type itemType)
        {
            PropertyInfo[] properties = itemType.GetProperties();
            int gap = 0;
            IRow row = sheet.CreateRow(0);

            string objectName = itemType.Name;
            if (exportObjectNames.ContainsKey(itemType.Name))
            {
                objectName = exportObjectNames[itemType.Name];
            }

            for (int colIndex = 0; colIndex < properties.Length; colIndex++)
            {
                if (HasAttribute<JsonIgnoreAttribute>(properties[colIndex]))
                {
                    gap++;
                    continue;
                }

                if (IsListOfT(properties[colIndex].PropertyType, out Type childType))
                {
                    gap++;
                    continue;
                }

                row.CreateCell(childColStartIndex + colIndex - gap).SetCellValue(objectName);
            }
        }

        private static void AddObjectHead(IRow headerRow, int childColStartIndex, Type itemType)
        {
            PropertyInfo[] properties = itemType.GetProperties();
            int gap = 0;

            // 创建单元格样式
            ICellStyle style = GenerateHeaderStype();

            for (int colIndex = 0; colIndex < properties.Length; colIndex++)
            {
                if (HasAttribute<JsonIgnoreAttribute>(properties[colIndex]))
                {
                    gap++;
                    continue;
                }

                if (IsListOfT(properties[colIndex].PropertyType, out Type childType))
                {
                    gap++;
                    continue;
                }

                ICell cell = headerRow.CreateCell(childColStartIndex + colIndex - gap);
                cell.SetCellValue(properties[colIndex].Name);
                cell.CellStyle = style;
            }
        }

        private static ICellStyle GenerateHeaderStype()
        {
            ICellStyle style = workbook.CreateCellStyle();

            // 设置单元格背景色
            style.FillPattern = FillPattern.SolidForeground;
            style.FillForegroundColor = IndexedColors.Black.Index;
            IFont font = workbook.CreateFont();
            font.Color = IndexedColors.White.Index;
            style.SetFont(font);
            return style;
        }

        private static void AddChildRecord(IRow row, int colIndex, object? value, Type itemType, ISheet sheet)
        {
            var list = (System.Collections.IEnumerable)value;

            IRow childRow = row;
            int i = 0;
            foreach (var child in list)
            {
                if (row.RowNum + 1 < rowIndex + i)
                {
                    childRow = sheet.CreateRow(rowIndex);
                    FillParentData(row, childRow, colIndex);
                    rowIndex++;
                }
                int gap = 0;

                // 获取 T 类型的所有属性
                PropertyInfo[] itemProperties = itemType.GetProperties();
                for (int childColIndex = 0; childColIndex < itemProperties.Length; childColIndex++)
                {
                    if (HasAttribute<JsonIgnoreAttribute>(itemProperties[childColIndex]))
                    {
                        gap++;
                        continue;
                    }
                    var propValue = itemProperties[childColIndex].GetValue(child);

                    if (propValue != null && IsListOfT(itemProperties[childColIndex].PropertyType, out Type childType))
                    {
                        gap++;
                        continue;
                    }
                    if (propValue is Volo.Abp.Data.ExtraPropertyDictionary)
                    {
                        childRow.CreateCell(colIndex + childColIndex - gap).SetCellValue(propValue == null ? "" : JsonSerializer.Serialize(propValue));
                    }
                    else
                    {
                        childRow.CreateCell(colIndex + childColIndex - gap).SetCellValue(propValue == null ? "" : propValue.ToString());
                    }
                }

                i++;
            }
        }

        private static void FillParentData(IRow row, IRow childRow, int colIndex)
        {
            for (int i = 0; i < colIndex; i++)
            {
                childRow.CreateCell(i).SetCellValue(row.Cells[i].StringCellValue);
            }
        }
    }
}
