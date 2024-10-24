import{_ as a,o as i,c as n,a2 as e}from"./chunks/framework.D-6dkPHk.js";const E=JSON.parse('{"title":"骨架屏优化——细粒度模式的实现","description":"","frontmatter":{"title":"骨架屏优化——细粒度模式的实现","date":"2021-10-20T00:00:00.000Z","tags":["Vue.js"]},"headers":[],"relativePath":"posts/前端/骨架屏优化——细粒度模式的实现.md","filePath":"posts/前端/骨架屏优化——细粒度模式的实现.md","lastUpdated":1729744975000}'),t={name:"posts/前端/骨架屏优化——细粒度模式的实现.md"};function l(p,s,h,r,k,o){return i(),n("div",null,s[0]||(s[0]=[e(`<h1 id="骨架屏优化——细粒度模式的实现" tabindex="-1">骨架屏优化——细粒度模式的实现 <a class="header-anchor" href="#骨架屏优化——细粒度模式的实现" aria-label="Permalink to &quot;骨架屏优化——细粒度模式的实现&quot;">​</a></h1><p>之前总结了给 DevUI 开发骨架屏（Skeleton）的一些心得，Kagol 老师看到之后提出增加细粒度模式。之所以到现在才更新，一方面是因为最近换了个项目组，另一方面是思考如何设计 API 让两种模式风格统一（才不是因为 lol 手游和云顶 S6 的关系）。</p><p><img src="https://raw.githubusercontent.com/ivestszheng/images-store/master/img/20211114214832.png" alt="Kagol 拼接模式建议" loading="lazy"></p><h2 id="两种模式" tabindex="-1">两种模式 <a class="header-anchor" href="#两种模式" aria-label="Permalink to &quot;两种模式&quot;">​</a></h2><h3 id="拼接模式" tabindex="-1">拼接模式 <a class="header-anchor" href="#拼接模式" aria-label="Permalink to &quot;拼接模式&quot;">​</a></h3><p>默认模式即粗粒度模式，也可以看作是细粒度的拼接模式。这个模式下，骨架屏大致包含头像、标题、段落，如下图所示。</p><p><img src="https://raw.githubusercontent.com/ivestszheng/images-store/master/img/20211020100014.gif" alt="常见骨架屏" loading="lazy"></p><h3 id="细粒度模式" tabindex="-1">细粒度模式 <a class="header-anchor" href="#细粒度模式" aria-label="Permalink to &quot;细粒度模式&quot;">​</a></h3><p>即指完整的骨架屏被拆成细粒度的骨架屏元素，从图形的角度可以分为圆形和矩形，从功能的角度可以分为占位头像、占位图像、占位标题、占位内容、占位按钮。</p><p><img src="https://raw.githubusercontent.com/ivestszheng/images-store/master/img/20211122120101.gif" alt="拼接模式" loading="lazy"></p><h3 id="比较" tabindex="-1">比较 <a class="header-anchor" href="#比较" aria-label="Permalink to &quot;比较&quot;">​</a></h3><p>相比默认模式，细粒度的骨架屏元素给使用这个组件的开发者提供了更大的灵活和定制能力。市面上，Element-ui 和 Vant-ui 采用默认模式，抖音的 SemiDesign 采用拼接模式，Antd 则兼具二者。似乎 React 的组件库会更倾向于细粒度？</p><h2 id="api-设计" tabindex="-1">API 设计 <a class="header-anchor" href="#api-设计" aria-label="Permalink to &quot;API 设计&quot;">​</a></h2><p>默认模式下，由于多个元素被包裹在根节点下，不方便直接设置样式，所以提供了许多样式 API 。而在拼接模式下，由于本身就是多根节点，类似宽高等样式可以直接通过 style 去控制，再设计额外的 API 就显得多余。</p><h2 id="非-prop-的-attribute" tabindex="-1">非 Prop 的 Attribute <a class="header-anchor" href="#非-prop-的-attribute" aria-label="Permalink to &quot;非 Prop 的 Attribute&quot;">​</a></h2><p>当我尝试直接通过 style 去控制组件的样式时，控制台报了警告，而之前在默认模式下没有这个问题，我又试了试 ICON 组件发现了同样的问题。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>Extraneous non-props attributes (class) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>起初我还以为这是项目没有做相关配置的问题，后来在行言同学的指导下发现了问题。</p><p><img src="https://raw.githubusercontent.com/ivestszheng/images-store/master/img/20211118155453.png" alt="行言同学的建议" loading="lazy"></p><p>Vue 3 文档的表述是：一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 <a href="https://v3.cn.vuejs.org/guide/component-props" target="_blank" rel="noreferrer">props</a> 或 <a href="https://v3.cn.vuejs.org/guide/component-custom-events.html#%E5%AE%9A%E4%B9%89%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6" target="_blank" rel="noreferrer">emits</a> 定义的 attribute。常见的示例包括 <code>class</code>、<code>style</code> 和 <code>id</code> attribute。可以通过 <code>$attrs</code> property 访问那些 attribute。</p><p>在 JSX 中用<code>ctx.attrs</code>来传入，具体如下：</p><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`devui-skeleton__shape__\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">props</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">shape</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">} \${</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">renderAnimate</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    props</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">animate</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  )</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  {</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ctx.attrs}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-label="Permalink to &quot;实现&quot;">​</a></h2><p>第一版 PR 尽管在功能上实现了，但在 code review 的时候给打回了，原因在于两种模式放在同一个文件下导致内容太大，功能比较杂乱。</p><p>Kagol 眼中的理想的模式应该是：</p><ol><li>将骨架屏划分成<code>d-skeleton</code>和<code>d-skeleton-item</code>。</li><li><code>d-skeleton</code>组件其实只是将<code>d-skeleton-item</code>拼接起来，我们可以内置一些拼接模式，这部分和目前实现的 API 可以保持一致。</li></ol><p>因此我将拼接模式的代码拆分到 item 文件夹下，再在 index 中通过 <code>app.component</code>注册组件。最终单个 TSX 文件长度控制在了 150 行以内。</p><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { App } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;vue&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Skeleton </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;./src/skeleton&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SkeletonItem </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;./src/item/item&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Skeleton.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">install</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> App</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Skeleton.name, Skeleton);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(SkeletonItem.name, SkeletonItem);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { Skeleton, SkeletonItem };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Skeleton 骨架屏&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  category: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;数据展示&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  status: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;已完成&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  install</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> App</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Skeleton </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> any</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ol><li><a href="https://v3.cn.vuejs.org/guide/component-attrs.html#attribute-%E7%BB%A7%E6%89%BF" target="_blank" rel="noreferrer">非 Prop 的 Attribute</a></li><li><a href="https://mp.weixin.qq.com/s/SNC5pq89No9036An1Im0uw" target="_blank" rel="noreferrer">Vue3 JSX 使用指南</a></li></ol><h2 id="闲谈" tabindex="-1">闲谈 <a class="header-anchor" href="#闲谈" aria-label="Permalink to &quot;闲谈&quot;">​</a></h2><p>秀下 DevUI 发的抱枕（<s>掘金的徽章啥时候才能到呢</s>）</p><p><img src="https://raw.githubusercontent.com/ivestszheng/images-store/master/img/20211122224615.jpg" alt="" loading="lazy"></p>`,33)]))}const c=a(t,[["render",l]]);export{E as __pageData,c as default};
