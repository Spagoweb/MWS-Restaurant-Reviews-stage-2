# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 2

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage Two**, you will take the responsive, accessible design you built in **Stage One** and connect it to an external server. You’ll begin by using asynchronous JavaScript to request JSON data from the server. You’ll store data received from the server in an offline database using IndexedDB, which will create an app shell architecture. Finally, you’ll work to optimize your site to meet performance benchmarks, which you’ll test using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

### Specification

You will be provided code for a Node development server and a README for getting the server up and running locally on your computer. The README will also contain the API you will need to make JSON requests to the server. Once you have the server up, you will begin the work of improving your **Stage One** project code.

The core functionality of the application will not change for this stage. Only the source of the data will change. You will use the `fetch()` API to make requests to the server to populate the content of your Restaurant Reviews app.

### Steps to complete

1. Fork and clone the [server repository](https://github.com/udacity/mws-restaurant-stage-2). You’ll use this development server to develop your project code.
2. Change the data source for your restaurant requests to pull JSON from the server, parse the response and use the response to generate the site UI.
3. Cache the JSON responses for offline use by using the IndexedDB API.
4. Follow the recommendations provided by Lighthouse to achieve the required performance targets.
5. Submit your project code for review.
