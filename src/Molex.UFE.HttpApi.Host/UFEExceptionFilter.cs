using System;
using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Molex.UFE.Localization;
using Serilog.Core;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Identity;
using Volo.Abp.Users;
using Volo.Abp.Validation;

namespace Molex.UFE
{
    public class UFEExceptionFilter : IExceptionFilter
    {
        private IHostEnvironment _hostEnvironment;
        private IStringLocalizer<UFEResource> _localizer;
        private ILogger<UFEExceptionFilter> _logger;

        ICurrentUser _currentUser;
        public UFEExceptionFilter(IHostEnvironment hostEnvironment, IStringLocalizer<UFEResource> localizer,ILogger<UFEExceptionFilter> logger,ICurrentUser currentUser)
        {
            _hostEnvironment = hostEnvironment;
            _localizer = localizer;
            _logger = logger;
            _currentUser = currentUser;
        }

        public void OnException(ExceptionContext context)
        {
            _logger.LogError(context.Exception.ToString());
            // Handle AbpIdentityResultException
            if (context.Exception is AbpIdentityResultException abpIdentityResultException)
            {
                // Extract error details from IdentityResult
                var errorDetails = abpIdentityResultException.IdentityResult.Errors
                    .Select((e, index) => new { Index = index.ToString(), Value = e.Description })
                    .ToDictionary(e => e.Index, e => e.Value);

                var errorDetail = ErrorDetailHelper.GetErrorDetail(
                    _localizer["MSG_AbpIdentityResultAction"],
                    UFEConsts.AbpIdentityResult
                );

                context.Result = new ObjectResult(new
                {
                    error = new
                    {
                        code = abpIdentityResultException.Code,
                        message = abpIdentityResultException.Message,
                        details = errorDetail,
                        data = errorDetails, // Match the default structure
                        validationErrors = (object)null // Explicitly set to null
                    }
                })
                {
                    StatusCode = 403 //Set status code to 403 Forbidden
                };

                context.ExceptionHandled = true;
                return;
            }
            else if (context.Exception is UserFriendlyException userFriendlyException)
            {
                context.Result = new ObjectResult(new
                {
                    error = new
                    {
                        code = userFriendlyException.Code,
                        message = userFriendlyException.Message,
                        details = userFriendlyException.Details
                    },
                    Data = context.Exception.ToString()
                })
                {
                    StatusCode = 403
                };
                return;
            }
            else if (context.Exception is AbpAuthorizationException authorizationException)
            {
                if (_currentUser.Id == null)
                {
                    context.Result = new ObjectResult(null)
                    {
                        StatusCode = 401
                    };
                }
                else
                {
                    var errorDetailForOtherExceptions = ErrorDetailHelper.GetErrorDetail(_localizer["MSG_GrantPermission"], authorizationException.Code);
                    context.Result = new ObjectResult(new
                    {
                        error = new
                        {
                            code = authorizationException.Code,
                            message = _localizer.GetString("ERROR_AccessDenied"),
                            details = errorDetailForOtherExceptions
                        },
                        Data = context.Exception.ToString()
                    })
                    {
                        StatusCode = 403
                    };
                }

                return;
            }
            else
            {
                // Handle other exceptions
                var errorDetailForOtherExceptions = ErrorDetailHelper.GetErrorDetail(
                    _hostEnvironment.IsDevelopment() ? null : _localizer["MSG_ContactSupport"],
                    _hostEnvironment.IsDevelopment() ? null : UFEConsts.UnexpectedError
                );

                if (_hostEnvironment.IsDevelopment())
                {
                    context.Result = new ContentResult
                    {
                        Content = context.Exception.ToString(),
                        StatusCode = 500 // Set status code to 500 Internal Server Error
                    };
                }
                else
                {

                    context.Result = new ObjectResult(new
                    {
                        error = new
                        {
                            code = UFEDomainErrorCodes.InternalServerError,
                            message = _localizer["ERROR_UnexpectedError"],
                            details = errorDetailForOtherExceptions
                        },
                        Data = context.Exception.ToString()
                    })
                    {
                        StatusCode = 500 //Set status code to 500 Internal Server Error
                    };
                }


            }
        }
    }
}