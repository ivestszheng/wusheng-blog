import{_ as i,o as a,c as n,a2 as e}from"./chunks/framework.D-6dkPHk.js";const o=JSON.parse('{"title":"在 VitePress 中集成 TailwindCSS","description":"","frontmatter":{"title":"在 VitePress 中集成 TailwindCSS","date":"2024-04-05T00:00:00.000Z","abstract":"手把手教你如何在 VitePress 中集成 TailwindCSS。","tags":["VitePress"]},"headers":[],"relativePath":"posts/前端/在 VitePress 中集成 TailwindCSS.md","filePath":"posts/前端/在 VitePress 中集成 TailwindCSS.md","lastUpdated":1729744975000}'),l={name:"posts/前端/在 VitePress 中集成 TailwindCSS.md"};function t(p,s,h,r,k,d){return a(),n("div",null,s[0]||(s[0]=[e(`<h1 id="在-vitepress-中集成-tailwindcss" tabindex="-1">在 VitePress 中集成 TailwindCSS <a class="header-anchor" href="#在-vitepress-中集成-tailwindcss" aria-label="Permalink to &quot;在 VitePress 中集成 TailwindCSS&quot;">​</a></h1><h2 id="添加依赖" tabindex="-1">添加依赖 <a class="header-anchor" href="#添加依赖" aria-label="Permalink to &quot;添加依赖&quot;">​</a></h2><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tailwindcss</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @tailwindcss/postcss7-compat</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postcss</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> autoprefixer</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -D</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="初始化-tailwind-配置文件" tabindex="-1">初始化 Tailwind 配置文件 <a class="header-anchor" href="#初始化-tailwind-配置文件" aria-label="Permalink to &quot;初始化 Tailwind 配置文件&quot;">​</a></h2><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dlx</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tailwindcss</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> init</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>执行命令后，根目录下会生成文件 <code>tailwind.config.js</code></p><h2 id="修改-tailwind-配置文件" tabindex="-1">修改 Tailwind 配置文件 <a class="header-anchor" href="#修改-tailwind-配置文件" aria-label="Permalink to &quot;修改 Tailwind 配置文件&quot;">​</a></h2><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// tailwind.config.js</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/** </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> {import(&#39;tailwindcss&#39;).Config}</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  content: [</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;./docs/**/*.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;./docs/**/*.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;./docs/**/*.vue&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;./docs/**/*.md&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  options: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    safelist: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;html&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;body&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>docs 是 VitePress 默认的<a href="https://vitepress.dev/zh/guide/routing#root-and-source-directory" target="_blank" rel="noreferrer"><em>项目根目录</em></a>。</p><h2 id="添加-tailwind-指令到主-css-文件" tabindex="-1">添加 Tailwind 指令到主 CSS 文件 <a class="header-anchor" href="#添加-tailwind-指令到主-css-文件" aria-label="Permalink to &quot;添加 Tailwind 指令到主 CSS 文件&quot;">​</a></h2><div class="language-css vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// </span><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">./docs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/</span><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">.vitepress/theme</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.css</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@tailwind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@tailwind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> components;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@tailwind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> utilities;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>主 CSS 文件的名称随意，注意放在 theme 路径下即可</p><h2 id="引入主-css-文件" tabindex="-1">引入主 CSS 文件 <a class="header-anchor" href="#引入主-css-文件" aria-label="Permalink to &quot;引入主 CSS 文件&quot;">​</a></h2><p>需要在 <code>.vitepress/theme/index.js</code> 或 <code>.vitepress/theme/index.ts</code> 文件 (即<a href="https://vitepress.dev/zh/guide/custom-theme#theme-resolving" target="_blank" rel="noreferrer">“主题入口文件”</a>) 中引入主 CSS。</p><div class="language-typescript vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//  docs/.vitepress/theme/index.ts</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;./tailwind.css&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 此处省略了其他配置</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="创建-postcss-config-cjs" tabindex="-1">创建 postcss.config.cjs <a class="header-anchor" href="#创建-postcss-config-cjs" aria-label="Permalink to &quot;创建 postcss.config.cjs&quot;">​</a></h2><p>在根目录下创建 <code>post.config.cjs</code></p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// post.config.cjs</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  plugins: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    tailwindcss: {},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    autoprefixer: {},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>如果以 <code>.js</code> 作为后缀可能会遇到 ReferenceError，如下所示：</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[ReferenceError] module is not defined </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ES module scope</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">This</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> file</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> is</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> being</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> treated</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> as</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> an</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ES</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> module</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> because</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> has</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> a</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;.js&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> file</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> extension</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> and</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;[filePath]\\package.json&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> contains</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;type&quot;:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;module&quot;.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> To</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> treat</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> as</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> a</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> CommonJS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> script,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rename</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> to</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> the</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;.cjs&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> file</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> extension.</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>所以最好以 <code>.cjs</code> 作为后缀。</p><p>至此，我们完成了在 VitePress 中集成 TailwindCSS。</p><h2 id="参考资料" tabindex="-1">参考资料 <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料&quot;">​</a></h2><ol><li><a href="https://carljin.com/posts/vitepress_antd_tailwind_zoom_image/" target="_blank" rel="noreferrer">VitePress + Tailwind + ant-design-vue + 图片放大 功能使用</a></li><li><a href="https://vitepress.dev/zh/" target="_blank" rel="noreferrer">VitePress</a></li></ol>`,24)]))}const F=i(l,[["render",t]]);export{o as __pageData,F as default};
