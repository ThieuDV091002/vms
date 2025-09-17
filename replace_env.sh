#!/bin/sh

# check ENV_BASE_URL exists
if [ -n "$ENV_BASE_URL" ]; then
  sed -i "s|ENV_BASE_URL|${ENV_BASE_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_BASE_URL not set."
fi

# check ENV_AUTHORITY_URL exists
if [ -n "$ENV_AUTHORITY_URL" ]; then
  sed -i "s|ENV_AUTHORITY_URL|${ENV_AUTHORITY_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_AUTHORITY_URL not set."
fi

# check ENV_API_URL exists
if [ -n "$ENV_API_URL" ]; then
  sed -i "s|ENV_API_URL|${ENV_API_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_API_URL not set."
fi

# check ENV_TICKET_URL exists
if [ -n "$ENV_TICKET_URL" ]; then
  sed -i "s|ENV_TICKET_URL|${ENV_TICKET_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_TICKET_URL not set."
fi

# check ENV_CORPORATE_URL exists
if [ -n "$ENV_CORPORATE_URL" ]; then
  sed -i "s|ENV_CORPORATE_URL|${ENV_CORPORATE_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_CORPORATE_URL not set."
fi

# check ENV_DASHBOARD_URL exists
if [ -n "$ENV_DASHBOARD_URL" ]; then
  sed -i "s|ENV_DASHBOARD_URL|${ENV_DASHBOARD_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_DASHBOARD_URL not set."
fi

# check ENV_NOTIFICATION_URL exists
if [ -n "$ENV_NOTIFICATION_URL" ]; then
  sed -i "s|ENV_NOTIFICATION_URL|${ENV_NOTIFICATION_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_NOTIFICATION_URL not set."
fi

# check ENV_GENERAL_URL exists
if [ -n "$ENV_GENERAL_URL" ]; then
  sed -i "s|ENV_GENERAL_URL|${ENV_GENERAL_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_GENERAL_URL not set."
fi

# check ENV_SCHEDULER_URL exists
if [ -n "$ENV_SCHEDULER_URL" ]; then
  sed -i "s|ENV_SCHEDULER_URL|${ENV_SCHEDULER_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_SCHEDULER_URL not set."
fi

# check ENV_REPORT_URL exists
if [ -n "$ENV_REPORT_URL" ]; then
  sed -i "s|ENV_REPORT_URL|${ENV_REPORT_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_REPORT_URL not set."
fi

# check ENV_vms_URL exists
if [ -n "$ENV_vms_URL" ]; then
  sed -i "s|ENV_vms_URL|${ENV_vms_URL}|g" /usr/share/nginx/html/main*.js
else
  echo "ENV_vms_URL not set."
fi

# check ENV_VERSION exists
if [ -n "$ENV_NAME" ]; then
  sed -i "s|ENV_VERSION|${ENV_NAME} (${Version})|g" /usr/share/nginx/html/main*.js
else
  sed -i "s|ENV_VERSION|${Version}|g" /usr/share/nginx/html/main*.js
fi

# Add eruda debug tool for DEV environment
if [ -n "$ENV_NAME" ] && echo "$ENV_NAME" | grep -q "DEV"; then
  echo "Adding eruda debug tool for DEV environment"
  sed -i 's|</body>|<script src="assets/eruda.js"></script>\n<script>eruda.init();</script>\n</body>|g' /usr/share/nginx/html/index.html
fi

if( [ -n "$ENV_CDN" ]); then
 echo 'change $ENV_CDN to index.html'
  sed -i 's|<base href="/">||g' /usr/share/nginx/html/index.html
  sed -i "s|href=\"ngx\([^\"]*\.css\)\"|href=\"$ENV_CDN/ngx\1\"|g" /usr/share/nginx/html/index.html
  sed -i "s|href=\"font\([^\"]*\.css\)\"|href=\"$ENV_CDN/font\1\"|g" /usr/share/nginx/html/index.html
  sed -i "s|src=\"\([^\"]*\.js\)\"|src=\"$ENV_CDN/\1\"|g" /usr/share/nginx/html/index.html
  sed -i 's|url(/bootstrap|url('"$ENV_CDN"'/bootstrap|g' /usr/share/nginx/html/styles.*.css
  sed -i 's|ENV_CDNsrc/assets/|'"$ENV_CDN"'/assets/|g'  src/assets/styles/inter.css
  sed -i 's|ENV_CDN/assets/|'"$ENV_CDN"'/assets/|g'  src/styles.scss
else
  echo "ENV_CDN not set."
  sed -i 's|ENV_CDNsrc/assets/|/assets/|g'  src/assets/styles/inter.css
  sed -i 's|ENV_CDN/assets/|/assets/|g'  src/styles.scss
fi

if [ -e "/usr/share/nginx/html/redirect.js" ]; then
    echo "redirect.js exists"
    sed -i "s|</head>|<script src=\"redirect.js\" type=\"text/javascript\"></script></head>|g" /usr/share/nginx/html/index.html
else
    echo "redirect.js does not exist"
fi


if([ -n "$ENV_S3" ]) then
   # Check if the directory exists
  if [ -d $ENV_S3 ]; then
    # Add your logic here for ENV_S3
    echo "ENV_S3 is set and $ENV_S3 exists."
    cp -r /usr/share/nginx/html/* "$ENV_S3" 2>/dev/null || true
  else
    echo "/usr/share/nginx/html directory does not exist."
  fi
else
  echo "ENV_S3 not set."
fi


# run Nginx
nginx -g 'daemon off;'
