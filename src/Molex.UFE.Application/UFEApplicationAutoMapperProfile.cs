using AutoMapper;
using AutoMapper.Internal.Mappers;
using System;
using Molex.UFE;
using System.Reflection;
using Molex.UFE.Dtos;

namespace Molex.UFE;

public class UFEApplicationAutoMapperProfile : Profile
{
    public UFEApplicationAutoMapperProfile()
    {
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
        

    }

    public static void MapNotNullProperty(object source, object target)  
    {
            if (source == null || target == null)
            {
                throw new ArgumentNullException(source == null ? nameof(source) : nameof(target));
            }

            
            PropertyInfo[] dtoProperties = source.GetType().GetProperties();

           
            foreach (PropertyInfo dtoProperty in dtoProperties)
            {
                if (dtoProperty.Name == "Id")
                {
                    continue;
                }
               
                PropertyInfo targetProperty = target.GetType().GetProperty(dtoProperty.Name);

                if (targetProperty != null && dtoProperty.CanRead && targetProperty.CanWrite)
                {
                    
                    object dtoValue = dtoProperty.GetValue(source, null);

                    if (dtoValue != null)
                    {
                     
                        targetProperty.SetValue(target, dtoValue, null);
                    }
                }
            }
        
    }
}
