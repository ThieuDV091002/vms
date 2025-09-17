using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;

namespace Molex.UFE
{
    public static class CommonHelper
    {
        public static MemoryStream SerializeObjectToJsonStream(object obj)
        {
            // 配置JsonSerializerOptions以支持所有字符的直接输出而不是转义
            var options = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                //Encoder = JavaScriptEncoder.Create(UnicodeRanges.All) // 使用所有Unicode字符范围
            };

            var jsonBytes = JsonSerializer.SerializeToUtf8Bytes(obj, options);
            var jsonString = System.Text.Encoding.UTF8.GetString(jsonBytes);
            jsonString = jsonString.Replace("\\u0026", "&");
            var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(jsonString));
            return stream;
        }

        public static void SetPropertyValue(object obj, string propertyName, object value)
        {
            // 获取类型信息
            var type = obj.GetType();

            // 获取属性信息
            var property = type.GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance);

            if (property == null)
            {
                //throw new ArgumentException($"Property '{propertyName}' not found on type '{type.FullName}'");
                return;
            }

            // 检查属性是否具有 setter
            if (!property.CanWrite)
            {
                throw new ArgumentException($"Property '{propertyName}' does not have a setter");
            }

            // 设置属性值
            property.SetValue(obj, value);
        }
        public static object GetPropertyValueByName(object obj, string propertyName)
        {
            // 获取obj的类型  
            Type type = obj.GetType();

            // 获取Name属性信息  
            PropertyInfo property = type.GetProperty(propertyName);

            // 确保找到了属性并且它有getter方法  
            if (property != null && property.CanRead)
            {
                // 调用getter方法获取属性值  
                return property.GetValue(obj);
            }

            return null;
        }

        public static string GetDownloadFileName(string obj, FileType fileType)
        {
            string currentDateFormat = DateTime.Now.ToString("yyyy-MM-dd");
            string currentTime = DateTime.Now.ToString("HH-mm-ss");
            string fileName = $"{obj}_{currentDateFormat}_{currentTime}";

            if (fileType == FileType.Excel)
            {
                fileName = $"{fileName}.xlsx";
            }
            else
            {
                fileName = $"{fileName}.json";
            }

            return fileName;
        }

        public static List<T> DeserializeFromMemoryStream<T>(Stream memoryStream)
        {
            memoryStream.Seek(0, SeekOrigin.Begin); // 确保流的位置在开始
            return JsonSerializer.Deserialize<List<T>>(memoryStream);
        }

        public static List<T> DeserializeFromMemoryStream<T>(object fileStream)
        {
            throw new NotImplementedException();
        }
    }
}
