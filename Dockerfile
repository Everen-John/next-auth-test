#Use this specific version of NodeJS
FROM node:14

# Copy package.json and package-lock.json into container directory
COPY package*.json ./

# Run npm install with --product argument to only input production dependencies
RUN npm install --production

#copy the rest of the files like public, src, styles and so on into container directory
COPY . /

#Include environment variables into container to ensure process.env syntax returns proper values
ENV GOOGLE_ID 74156239160-gjhlv6rasdashqe0emq8e25bp6l600kb.apps.googleusercontent.com
ENV GOOGLE_SECRET qQVCgPcL9FAKES97U1eJf4W7
ENV PORT 3000

#Expose the port 3000 for users to access
EXPOSE 3000

#Run the build according to the given npm script "build"
#{
#  "name": "nodejs-app",
#  "version": "0.1.0",
#  "private": true,
#  "scripts": {
#    "build": "next build",
#  },
#
CMD ["npm","run" "build"]