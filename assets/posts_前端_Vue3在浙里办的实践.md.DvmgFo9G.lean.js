import{_ as s,o as n,c as a,a4 as p}from"./chunks/framework.CPfoFgza.js";const h=JSON.parse('{"title":"Vue3在浙里办的实践","description":"","frontmatter":{"title":"Vue3在浙里办的实践","date":"2022-12-11T00:00:00.000Z","abstract":"本文将从以下几方面展开：浙里办 H5 开发前需知、项目构建与技术选型、浙里办对接过程中遇到的问题及解决方案、项目一些需求的实现思路。"},"headers":[],"relativePath":"posts/前端/Vue3在浙里办的实践.md","filePath":"posts/前端/Vue3在浙里办的实践.md","lastUpdated":1711891944000}'),e={name:"posts/前端/Vue3在浙里办的实践.md"},l=p(`<h1 id="vue3-在浙里办的实践" tabindex="-1">Vue3 在浙里办的实践 <a class="header-anchor" href="#vue3-在浙里办的实践" aria-label="Permalink to &quot;Vue3 在浙里办的实践&quot;">​</a></h1><p>本人并非浙里办工作人员，不保证内容完全准确，若开发中有疑问，请先阅读完钉钉群内所有开发文档，再咨询钉钉群相关“技术支持”人员。若还是无法解决，请在掘金文章下留言，勿直接私信本人。本文将从以下几方面展开：</p><ol><li>浙里办 H5 开发前需知</li><li>项目构建与技术选型</li><li>浙里办对接过程中遇到的问题及解决方案</li><li>项目一些需求的实现思路</li></ol><hr><p><strong>2023 年更新：</strong> 由于项目的持续迭代，一些具体实现已与之前有了较大差异。同时为了更好的阅读体验，一些地方不再展示具体代码，请去文末提供的 demo 中查看。</p><h3 id="浙里办-h5-开发前需知" tabindex="-1">浙里办 H5 开发前需知 <a class="header-anchor" href="#浙里办-h5-开发前需知" aria-label="Permalink to &quot;浙里办 H5 开发前需知&quot;">​</a></h3><h3 id="章节概要" tabindex="-1">章节概要 <a class="header-anchor" href="#章节概要" aria-label="Permalink to &quot;章节概要&quot;">​</a></h3><p>本章节主要阐述一些浙里办开发涉及到的基础概念。应用开发前的申请流程，本人并不清楚，不做介绍。</p><h3 id="基础概念介绍" tabindex="-1">基础概念介绍 <a class="header-anchor" href="#基础概念介绍" aria-label="Permalink to &quot;基础概念介绍&quot;">​</a></h3><h4 id="浙里办" tabindex="-1">浙里办 <a class="header-anchor" href="#浙里办" aria-label="Permalink to &quot;浙里办&quot;">​</a></h4><p>浙里办是一款基于浙江政务服务网一体化平台能力的 APP。我们开发的应用可以通过浙里办 App、支护宝小程序及微信小程序访问。</p><h4 id="irs" tabindex="-1">IRS <a class="header-anchor" href="#irs" aria-label="Permalink to &quot;IRS&quot;">​</a></h4><p><a href="https://op-irs.zj.gov.cn/mobile/login?goto=/mobile" target="_blank" rel="noreferrer">IRS</a>指浙江省一体化数字资源系统平台。应用申请流程走完后会拿到 IRS 账号，我们在 IRS 上进行应用（指前端包）的部署与发布以及 RPC 接口的管理与更新。</p><h4 id="rpc" tabindex="-1">RPC <a class="header-anchor" href="#rpc" aria-label="Permalink to &quot;RPC&quot;">​</a></h4><p>RPC 服务器是指 Remote Procedure Call Protocol，中文释义为远程过程调用协议：一种通过网络从远程计算机程序上请求服务，而不需要了解底层网络技术的协议。</p><p>由于审核要求，浙里办客户端不直接请求服务器，通过 Mgop(相关描述请见下文)将请求发送至 RPC 服务器，再转发给真实的服务器。</p><h4 id="mgop" tabindex="-1">Mgop <a class="header-anchor" href="#mgop" aria-label="Permalink to &quot;Mgop&quot;">​</a></h4><p>Mgop 指 Npm 上的包<a href="https://www.npmjs.com/package/@aligov/jssdk-mgop" target="_blank" rel="noreferrer">@aligov/jssdk-mgop</a>，提供请求 RPC 上 API 的能力，有外网<a href="https://www.yuque.com/xiaoniaoge/run4dl/dge18k?" target="_blank" rel="noreferrer">语雀文档</a>。</p><h4 id="单点登录组件" tabindex="-1">单点登录组件 <a class="header-anchor" href="#单点登录组件" aria-label="Permalink to &quot;单点登录组件&quot;">​</a></h4><p>由于应用存在 APP、微信、支付宝这三种环境，需要通过不同的单点登录组件获取登录态。目前提供三种组件：</p><ol start="0"><li><p>政务服务网个人用户单点登录：支持 App、支付宝小程序、服务服务网 PC，需配置回调地址，入参为 ticket。</p></li><li><p>政务服务网法人用户单点登录：支持 App、政务服务网 pc 端，需配置回调地址。</p></li><li><p>”浙里办“统一单点登录：支持微信浙里办小程序、支付宝小程序，不涉及配置回调地址，入参为 ticketId，不能与上述 ticket 作为入参混用。</p><p><strong>注：据群内”技术支持“描述，小程序拿到的票据始终为 ticketId。但我实际开发过程中发现，九月时对接单点支付宝小程序获得的票据为 ticketId，而自 11 月底起只能获取到 ticket，且官方提供 ssoTicket 方法返回的 ticketId 始终为空。</strong></p></li></ol><h4 id="票据" tabindex="-1">票据 <a class="header-anchor" href="#票据" aria-label="Permalink to &quot;票据&quot;">​</a></h4><p>指 ticket 与 ticketId，使用不同的单点登录时需要使用不同票据，不能混用。</p><h2 id="项目构建与技术选型" tabindex="-1">项目构建与技术选型 <a class="header-anchor" href="#项目构建与技术选型" aria-label="Permalink to &quot;项目构建与技术选型&quot;">​</a></h2><h3 id="章节概要-1" tabindex="-1">章节概要 <a class="header-anchor" href="#章节概要-1" aria-label="Permalink to &quot;章节概要&quot;">​</a></h3><p>本章节主要介绍构建项目中对技术选型的一些思考。</p><h3 id="项目整体结构" tabindex="-1">项目整体结构 <a class="header-anchor" href="#项目整体结构" aria-label="Permalink to &quot;项目整体结构&quot;">​</a></h3><p>这里只展示我认为的重点部分，src 目录树如下图所示：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>│  App.vue</span></span>
<span class="line"><span>│  main.ts</span></span>
<span class="line"><span>│  shims-vue.d.ts</span></span>
<span class="line"><span>│  </span></span>
<span class="line"><span>├─apis  // api 接口存放目录，按模块划分</span></span>
<span class="line"><span>│      </span></span>
<span class="line"><span>├─assets    // 图片等静态资源</span></span>
<span class="line"><span>│              </span></span>
<span class="line"><span>├─components    // 公共组件</span></span>
<span class="line"><span>│      </span></span>
<span class="line"><span>├─composables   //  组合式函数，利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。</span></span>
<span class="line"><span>│  │  useBuryingPoint.ts    // 对浙里办埋点的封装</span></span>
<span class="line"><span>│  │  useOss.ts // 对阿里云OSS的封装</span></span>
<span class="line"><span>│  │  useSingleSignOn.ts    //  对浙里办单点登录的封装</span></span>
<span class="line"><span>│  │  useZwjsBridge.ts  //  对浙ZwjsBridge API的封装</span></span>
<span class="line"><span>│      </span></span>
<span class="line"><span>├─http  // 请求层</span></span>
<span class="line"><span>│      request.ts   // 对 axios 与 mgop 的集成</span></span>
<span class="line"><span>│      axiosInstance.ts // axios 的实例</span></span>
<span class="line"><span>│      useMgop.ts   // 对 mgop 的二次封装</span></span>
<span class="line"><span>│      useCostomApis.ts // 自定义的对 mgop 的拓展 api</span></span>
<span class="line"><span>│      </span></span>
<span class="line"><span>├─router    // 路由</span></span>
<span class="line"><span>│      </span></span>
<span class="line"><span>├─stores    // pinia 仓库，按模块划分</span></span>
<span class="line"><span>│  └─user   // 用户模块</span></span>
<span class="line"><span>│          </span></span>
<span class="line"><span>├─styles    // 样式存放目录</span></span>
<span class="line"><span>|</span></span>
<span class="line"><span>└─views     // 页面存放目录</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><h3 id="技术栈" tabindex="-1">技术栈 <a class="header-anchor" href="#技术栈" aria-label="Permalink to &quot;技术栈&quot;">​</a></h3><ul><li><a href="https://link.juejin.cn/?target=mailto%3AVue%403.2" target="_blank" rel="noreferrer">Vue@3.2</a></li><li><a href="https://link.juejin.cn/?target=mailto%3ATypeScript%405.4" target="_blank" rel="noreferrer">TypeScript@5.4</a></li><li>VueCli@5</li><li><a href="https://link.juejin.cn/?target=mailto%3AVantUi%403.5" target="_blank" rel="noreferrer">VantUi@3.5</a></li><li>Pinia@2</li><li><a href="https://link.juejin.cn/?target=mailto%3AAxios%400.27" target="_blank" rel="noreferrer">Axios@0.27</a></li><li><a href="https://link.juejin.cn/?target=mailto%3Azwjsbridge%401.1.0" target="_blank" rel="noreferrer">zwjsbridge@1.1.0</a></li><li><a href="https://link.juejin.cn/?target=mailto%3Azwlog%401.0" target="_blank" rel="noreferrer">zwlog@1.0</a></li></ul><h3 id="技术选型" tabindex="-1">技术选型 <a class="header-anchor" href="#技术选型" aria-label="Permalink to &quot;技术选型&quot;">​</a></h3><h4 id="vue2-还是-vue3" tabindex="-1">Vue2 还是 Vue3 <a class="header-anchor" href="#vue2-还是-vue3" aria-label="Permalink to &quot;Vue2 还是 Vue3&quot;">​</a></h4><p>由于这个项目一开始的定位是一个小项目，团队配置就是一个前端加一个后端，所以项目前端架构由我自己把控。团队的技术栈以 Vue2 为主，不过我个人会倾向使用 Vue3，一来在 Vue3 中通过 composable 的形式可以更好地进行代码复用，二来这对我个人的成长也更有帮助。不过最后能否使用 Vue3 还是要根据运行环境来决定，好在经过多方调查，最后确认可以上 Vue3。</p><h4 id="vite-还是-webpack" tabindex="-1">Vite 还是 Webpack <a class="header-anchor" href="#vite-还是-webpack" aria-label="Permalink to &quot;Vite 还是 Webpack&quot;">​</a></h4><p>没有选用 Vite 的主要原因在于项目是通过 VueCli 构建的，我对这一套生态更加熟悉。加上当时了解到工期很紧，害怕使用 Vite 会遇到一些坑拖慢项目进度。不过现在 VueCli 已经进入了维护模式，加上 VueConf2022 上看到许多大公司已经将 Vite 用于生产环境，下一次构建项目时我会选择 Vite。</p><h4 id="pinia-还是-vuex" tabindex="-1">Pinia 还是 Vuex <a class="header-anchor" href="#pinia-还是-vuex" aria-label="Permalink to &quot;Pinia 还是 Vuex&quot;">​</a></h4><p>毫无疑问是 Pinia，它非常轻量，使用起来相当简洁。而且尤大在一次掘金的直播中明确表示了 Pinia 就是下一代 Vuex，出于对作者的尊重所以没有改名。</p><h4 id="aplus-还是-zwlog" tabindex="-1">Aplus 还是 Zwlog <a class="header-anchor" href="#aplus-还是-zwlog" aria-label="Permalink to &quot;Aplus 还是 Zwlog&quot;">​</a></h4><p>二者都是浙里办提供的埋点工具，浙里办官方更推荐使用新版的 Zwlog。</p><h4 id="vant" tabindex="-1">Vant <a class="header-anchor" href="#vant" aria-label="Permalink to &quot;Vant&quot;">​</a></h4><p>老牌组件库，成熟的使用方案与优秀的文档，我个人开发移动端时最常用的组件库。</p><h2 id="浙里办对接难点" tabindex="-1">浙里办对接难点 <a class="header-anchor" href="#浙里办对接难点" aria-label="Permalink to &quot;浙里办对接难点&quot;">​</a></h2><h3 id="单点登录" tabindex="-1">单点登录 <a class="header-anchor" href="#单点登录" aria-label="Permalink to &quot;单点登录&quot;">​</a></h3><h4 id="整体思路" tabindex="-1">整体思路 <a class="header-anchor" href="#整体思路" aria-label="Permalink to &quot;整体思路&quot;">​</a></h4><p>简单来说单点登录分为三个步骤：</p><ol start="0"><li>获取票据(<code>ticket</code>或<code>ticketId</code>)</li><li>根据票据换<code>token</code></li><li>根据<code>token</code>换用户信息</li></ol><p>根据实际拿到的票据，我们要调用不同的单点登录组件（不了解的请回头看章节<strong>基础概念介绍</strong>），根据我实际开发的情况来看，最后真实可用的是浙里办 App、支付宝小程序使用<strong>政府服务网个人用户单点登录组件</strong>（我司项目面向的是个人用户）；微信小程序使用的是 <strong>“浙里办”统一单点登录</strong>。</p><h4 id="判断容器环境" tabindex="-1">判断容器环境 <a class="header-anchor" href="#判断容器环境" aria-label="Permalink to &quot;判断容器环境&quot;">​</a></h4><p>由于不同容器环境下，获取票据的方式不同。实际单点登录前需要先判断环境，每个容器的<code>window.navigator.userAgent</code>携带的参数不同，具体见方法 getContainerEnv\`。</p><h4 id="问题-获取票据时产生的二次回退" tabindex="-1">问题：获取票据时产生的二次回退 <a class="header-anchor" href="#问题-获取票据时产生的二次回退" aria-label="Permalink to &quot;问题：获取票据时产生的二次回退&quot;">​</a></h4><p><strong>政府服务网个人用户单点登录组件</strong>通过重定向的方式将票据参数添加到 url 中，假设第一次打开应用访问的是首页 A，往 History 栈中添加首页 A。首页 A 执行获取票据逻辑，页面重定向至携带票据参数的首页 B，此时 History 栈中现在有两个记录：首页 B、首页 A。当用户从首页按后退时本应回到上层应用，由于栈中有两条记录，实际回到了首页 A，这个现象称其为<strong>二次回退</strong>。</p><p>解决这个问题我尝试了多种思路：</p><ol start="0"><li><p>不往 History 栈中 push，使用 replace</p><p><em>结果</em>：支付宝小程序不支持，仍出现两个窗口。</p></li><li><p>执行打开新的页面窗口后，执行浙里办 Api：<code>ZWJSBridge.close</code>将上一个窗口关闭。</p><p><em>结果</em>：App 支持，但体验不好；支付宝小程序不支持，仍出现两个窗口。</p></li><li><p>通过监听<code>popstate</code>事件，当首页进行后退操作时（还要判断条件为 History 或 state 判断再次后退是首页 A），关闭窗口。</p><p><em>结果</em>：失败，没能触发<code>popstate</code>事件动作。猜测后退事件优先级较高，页面已经被销毁，不会再执行相关操作。</p></li></ol><p>如果是单一容器解决二次回退相当简单，痛点在于容器环境复杂，表现结果不一致；运行机制处于黑箱。</p><p>最后的方案是在访问首页前增加一个过渡页，具体流程如下：</p><ol start="0"><li>打开应用，访问路径为<code>&#39;/&#39;</code>的过渡页，开始单点登录，页面重定向。</li><li>重定向至新的过渡页。</li><li>添加<code>popstate</code>监听器：当后退回到过渡页时，关闭页面。</li><li>判断页面携带票据信息，访问首页。</li></ol><p>现在从首页 B 后退并不会回到首页 A，而是先回到过渡页，这样能保证<code>popstate</code>监听器可以正常执行。这个方案在好处在于不用再关注容器环境与 History 栈的情况，即便未来增加的新的容器环境，这套方案同样适用。缺点在于增加了一个额外的页面，代码看上去不那么直观。</p><h4 id="具体代码" tabindex="-1">具体代码 <a class="header-anchor" href="#具体代码" aria-label="Permalink to &quot;具体代码&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// @/composables/useSingleSignOn.ts</span></span>
<span class="line"><span>import { reactive, onUnmounted } from &#39;vue&#39;;</span></span>
<span class="line"><span>import { useUserStore } from &quot;@/stores/user&quot;;</span></span>
<span class="line"><span>import {</span></span>
<span class="line"><span>  getAppToken,</span></span>
<span class="line"><span>  getMiniProgramToken,</span></span>
<span class="line"><span>  getAppUserInfo,</span></span>
<span class="line"><span>  getMiniProgramUserInfo</span></span>
<span class="line"><span>} from &#39;@/apis/user&#39;;</span></span>
<span class="line"><span>import router from &#39;@/router&#39;;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>const APP_UTL =</span></span>
<span class="line"><span>  \`https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/\${process.env.VUE_APP_ZLB_APP_ID}/lastTest/index.html\`;</span></span>
<span class="line"><span>const APP_TEST_URL = \`\${APP_UTL}?debug=true\`;</span></span>
<span class="line"><span>/** VUE_APP_ZLB_IS_ONLINE_ENV === &#39;false&#39; 时是测试环境，否则都是生产环境 */</span></span>
<span class="line"><span>const ZLB_URL = \`https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&amp;scope=1&amp;servicecode=\${process.env.VUE_APP_ZLB_ACCESS_KEY}&amp;\${process.env.VUE_APP_ZLB_IS_ONLINE_ENV === &#39;false&#39; ? \`redirectUrl=\${APP_TEST_URL}\` : \`goto=\${APP_UTL}\`}\`;</span></span>
<span class="line"><span>const ZFB_URL = \`https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&amp;scope=1&amp;servicecode=\${process.env.VUE_APP_ZLB_ACCESS_KEY}&amp;\${process.env.VUE_APP_ZLB_IS_ONLINE_ENV === &#39;false&#39; ? \`redirectUrl=\${APP_TEST_URL}\` : \`goto=\${APP_UTL}\`}\`;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>type EnvironmentName = &#39;浙里办&#39; | &#39;支付宝&#39; | &#39;微信&#39; | &#39;未定义&#39; | string | undefined;</span></span>
<span class="line"><span>interface ISso {</span></span>
<span class="line"><span>  status: LogStatus,</span></span>
<span class="line"><span>  env: EnvironmentName,</span></span>
<span class="line"><span>  ticketId: string,</span></span>
<span class="line"><span>  zlbToken: string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>enum LogStatus {</span></span>
<span class="line"><span>  Unlogged = &#39;01&#39;,</span></span>
<span class="line"><span>  Logged = &#39;02&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @param status - 单点登录状态 0：未登录 1：登录成功</span></span>
<span class="line"><span> * @param env - 环境名</span></span>
<span class="line"><span> * @parma</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>const sso: ISso = reactive({</span></span>
<span class="line"><span>  status: LogStatus.Unlogged,</span></span>
<span class="line"><span>  env: &#39;&#39;,</span></span>
<span class="line"><span>  ticketId: &#39;&#39;,</span></span>
<span class="line"><span>  zlbToken: &#39;&#39;,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>// 这里写的有点多余了，直接用枚举类会更好</span></span>
<span class="line"><span>const CONTAINER_ENV_MAP = new Map([</span></span>
<span class="line"><span>  [0, &quot;未定义&quot;],</span></span>
<span class="line"><span>  [1, &quot;浙里办&quot;],</span></span>
<span class="line"><span>  [2, &quot;支付宝&quot;],</span></span>
<span class="line"><span>  [3, &quot;微信&quot;],</span></span>
<span class="line"><span>]);</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>export default function useSingleSignOn() {</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span> * 获取当前环境</span></span>
<span class="line"><span> * @returns</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>  function getContainerEnv(): EnvironmentName {</span></span>
<span class="line"><span>    const sUserAgent = window.navigator.userAgent.toLowerCase();</span></span>
<span class="line"><span>    let keyOfContainerEnv;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>    if (sUserAgent.indexOf(&quot;dtdreamweb&quot;) &gt; -1) {</span></span>
<span class="line"><span>      keyOfContainerEnv = 1;</span></span>
<span class="line"><span>    } else if (</span></span>
<span class="line"><span>      sUserAgent.indexOf(&quot;miniprogram&quot;) &gt; -1 &amp;&amp;</span></span>
<span class="line"><span>      sUserAgent.indexOf(&quot;alipay&quot;) &gt; -1</span></span>
<span class="line"><span>    ) {</span></span>
<span class="line"><span>      keyOfContainerEnv = 2;</span></span>
<span class="line"><span>    } else if (</span></span>
<span class="line"><span>      sUserAgent.indexOf(&quot;miniprogram&quot;) &gt; -1 &amp;&amp;</span></span>
<span class="line"><span>      (sUserAgent.indexOf(&quot;wx&quot;) &gt; -1 || sUserAgent.indexOf(&quot;wechat&quot;) &gt; -1)</span></span>
<span class="line"><span>    ) {</span></span>
<span class="line"><span>      keyOfContainerEnv = 3;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      keyOfContainerEnv = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>    sso.env = CONTAINER_ENV_MAP.get(keyOfContainerEnv);</span></span>
<span class="line"><span>    console.log(&#39;当前环境&#39;,sso.env);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return CONTAINER_ENV_MAP.get(keyOfContainerEnv) as EnvironmentName;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 获取票据 ticketId</span></span>
<span class="line"><span>   * @param environmentName - 当前使用环境名</span></span>
<span class="line"><span>   * @returns ticketId || null</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  async function getZlbTicket(environmentName: EnvironmentName) {</span></span>
<span class="line"><span>    switch (environmentName) {</span></span>
<span class="line"><span>      case &quot;浙里办&quot;: {</span></span>
<span class="line"><span>        const regex = /(ticket=)(.+-ticket)/;</span></span>
<span class="line"><span>        if (window.location.search.match(regex)) {</span></span>
<span class="line"><span>          console.log(&#39;浙里办获取ticket&#39;, window.location.search.match(regex)![2]);</span></span>
<span class="line"><span>          return window.location.search.match(regex)![2];</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          window.location.replace(ZLB_URL);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      case &quot;支付宝&quot;: {</span></span>
<span class="line"><span>        const regex = /(ticket=)(.+-ticket)/;</span></span>
<span class="line"><span>        if (window.location.search.match(regex)) {</span></span>
<span class="line"><span>          console.log(&#39;支付宝获取ticket&#39;, window.location.search.match(regex)![2]);</span></span>
<span class="line"><span>          return window.location.search.match(regex)![2];</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          window.location.replace(ZFB_URL);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      case &quot;微信&quot;: {</span></span>
<span class="line"><span>        if (ZWJSBridge.ssoTicket) {</span></span>
<span class="line"><span>          const ssoFlag = await ZWJSBridge.ssoTicket({});</span></span>
<span class="line"><span>          console.log(&#39;ssoFlag&#39;, ssoFlag);</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>          if (ssoFlag &amp;&amp; ssoFlag.result === true) {</span></span>
<span class="line"><span>            if (ssoFlag.ticketId) {</span></span>
<span class="line"><span>              console.log(&quot;小程序获取ticketId:&quot;, ssoFlag.ticketId);</span></span>
<span class="line"><span>              return ssoFlag.ticketId;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>              // 当“浙里办”单点登录失败或登录态失效时调用 ZWJSBridge.openLink 方法重新获取 ticketId</span></span>
<span class="line"><span>              return ZWJSBridge.openLink({ type: &quot;reload&quot; }).then(res =&gt; res.ticketId);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            throw new Error(&quot;小程序获取 ticketId 失败,ssoTicket 方法没有返回 ticketId&quot;);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          throw new Error(&quot;ssoTicket 方法不存在，确保在浙里办小程序中访问应用&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      default:</span></span>
<span class="line"><span>        throw new Error(&#39;获取ticketId失败，预期外的输入条件&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 通过票据获取 token</span></span>
<span class="line"><span>   * @param ticket - 票据</span></span>
<span class="line"><span>   * @param env - 环境名</span></span>
<span class="line"><span>   * @returns</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  async function getZlbToken(ticket: string, { env: environmentName }) {</span></span>
<span class="line"><span>    if (ticket) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        switch (environmentName) {</span></span>
<span class="line"><span>          case &quot;支付宝&quot;:</span></span>
<span class="line"><span>          case &quot;浙里办&quot;: {</span></span>
<span class="line"><span>            const res: any = await getAppToken(ticket);</span></span>
<span class="line"><span>            return res.data.token;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          case &quot;微信&quot;:</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>              const res: any = await getMiniProgramToken(ticket);</span></span>
<span class="line"><span>              console.log(\`小程序拿到的浙里办token:\${JSON.stringify(res)}\`);</span></span>
<span class="line"><span>              return res.data;</span></span>
<span class="line"><span>              break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>          default:</span></span>
<span class="line"><span>            throw new Error(&quot;当前环境未识别，无法获取token&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>      } catch (e: any) {</span></span>
<span class="line"><span>        throw new Error(\`\${environmentName}票据换浙里办token失败：\${e.message}\`);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      throw new Error(&#39;票据不存在&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 通过 token 获取当前登录用户的用户信息</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  async function getUserInfo(zlbToken: string, { env: environmentName }) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      switch (environmentName) {</span></span>
<span class="line"><span>        case &quot;支付宝&quot;:</span></span>
<span class="line"><span>        case &quot;浙里办&quot;: {</span></span>
<span class="line"><span>          const res: any = await getAppUserInfo(zlbToken);</span></span>
<span class="line"><span>          return {</span></span>
<span class="line"><span>            username: res?.data?.username,</span></span>
<span class="line"><span>            mobile: res?.data?.mobile,</span></span>
<span class="line"><span>            idnum: res?.data?.idnum,</span></span>
<span class="line"><span>            userid: res?.data?.userid,</span></span>
<span class="line"><span>          };</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        case &quot;微信&quot;: {</span></span>
<span class="line"><span>          const res: any = await getMiniProgramUserInfo(zlbToken);</span></span>
<span class="line"><span>          return {</span></span>
<span class="line"><span>            username: res?.data?.userNameEnc,</span></span>
<span class="line"><span>            mobile: res?.data?.phoneEnc,</span></span>
<span class="line"><span>            idnum: res?.data?.idNoEnc,</span></span>
<span class="line"><span>            userid: res?.data?.userid,</span></span>
<span class="line"><span>          };</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>    } catch (e: any) {</span></span>
<span class="line"><span>      throw new Error(\`\${environmentName}通过 token 获取当前登录用户的用户信息失败：\${e.message}\`);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>  async function singleSignOn() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      const userStore = useUserStore();</span></span>
<span class="line"><span>      userStore.env = getContainerEnv();</span></span>
<span class="line"><span>      // 监听后退事件，当后退回到过渡页时,直接关闭页面.</span></span>
<span class="line"><span>      const watchPopstate = () =&gt; {</span></span>
<span class="line"><span>        if (window.history.state?.current === &#39;/&#39;) {</span></span>
<span class="line"><span>          if (sso.env === &#39;支付宝&#39;) {</span></span>
<span class="line"><span>            /** 支付宝环境Api，不需要额外引入文件可以直接使用。实际上我觉得这里可以不判断环境，直接使用ZWJSBridge.close */</span></span>
<span class="line"><span>            my.navigateBack();</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            ZWJSBridge.close();</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      };</span></span>
<span class="line"><span>      window.addEventListener(&quot;popstate&quot;, watchPopstate, false);</span></span>
<span class="line"><span>      onUnmounted(() =&gt; window.removeEventListener(&quot;popstate&quot;, watchPopstate));</span></span>
<span class="line"><span>      sso.ticketId = await getZlbTicket(sso.env);</span></span>
<span class="line"><span>      // 从过渡页跳转至首页</span></span>
<span class="line"><span>      router.push({ name: &#39;home&#39; });</span></span>
<span class="line"><span>      // 获取用户信息</span></span>
<span class="line"><span>      if (sso.ticketId) {</span></span>
<span class="line"><span>        sso.zlbToken = await getZlbToken(sso.ticketId, { env: sso.env });</span></span>
<span class="line"><span>        const userInfo: any = await getUserInfo(sso.zlbToken, { env: sso.env });</span></span>
<span class="line"><span>        sso.status = LogStatus.Logged;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if (userInfo !== null &amp;&amp; userInfo !== undefined) {</span></span>
<span class="line"><span>          userStore.username = userInfo.username;</span></span>
<span class="line"><span>          userStore.mobile = userInfo.mobile;</span></span>
<span class="line"><span>          userStore.idnum = userInfo.idnum;</span></span>
<span class="line"><span>          userStore.userid = userInfo.userid;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return { ...sso, ...userInfo };</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return { ...sso };</span></span>
<span class="line"><span>    } catch (e: any) {</span></span>
<span class="line"><span>      throw new Error(\`单点登录失败：\${e?.message ?? JSON.stringify(e)}\`);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    sso,</span></span>
<span class="line"><span>    getContainerEnv,</span></span>
<span class="line"><span>    getZlbTicket,</span></span>
<span class="line"><span>    getZlbToken,</span></span>
<span class="line"><span>    getUserInfo,</span></span>
<span class="line"><span>    singleSignOn</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br></div></div><h3 id="请求层封装" tabindex="-1">请求层封装 <a class="header-anchor" href="#请求层封装" aria-label="Permalink to &quot;请求层封装&quot;">​</a></h3><h4 id="请求层生产环境与开发环境不一致" tabindex="-1">请求层生产环境与开发环境不一致 <a class="header-anchor" href="#请求层生产环境与开发环境不一致" aria-label="Permalink to &quot;请求层生产环境与开发环境不一致&quot;">​</a></h4><p>在<code>基础概念介绍</code>章节中提到了，前端项目部署后需要通过 mgop 访问 RPC 再访问真实的服务端，而 mgop 在开发环境是无法使用的。</p><p><strong>解决方案</strong></p><p>封装一个 request 请求工具，当<code>NODE_ENV</code>这个环境变量是<code>production</code>时调用 mgop，否则调用 axios。</p><h4 id="调用接口报-网络错误-的异常" tabindex="-1">调用接口报“网络错误”的异常 <a class="header-anchor" href="#调用接口报-网络错误-的异常" aria-label="Permalink to &quot;调用接口报“网络错误”的异常&quot;">​</a></h4><p>直接请求服务器上的接口正常，但是 mgop 调用 rpc 上 api 显示“网络错误”异常，大概率是 RPC 和服务器没有走通。</p><p><strong>解决方案</strong></p><ol start="0"><li>使用<code>工作台 &gt; RPC 接入 &gt; API管理</code>调试先测试能否正常返回结果。</li><li>确保接口入参出参都为 JSON 格式。</li></ol><h4 id="访问联调地址的接口" tabindex="-1">访问联调地址的接口 <a class="header-anchor" href="#访问联调地址的接口" aria-label="Permalink to &quot;访问联调地址的接口&quot;">​</a></h4><p>使用<code>mgop</code>默认访问生产环境，如果需要访问联调地址的要在加上请求头，对应下面的代码：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span> /** 当请求头 isTestUrl 为 &quot;1&quot; 时，使用联调环境，实测传其他值例如&quot;&quot;，&quot;0&quot; 仍然会使用联调环境&quot;，传参为null时ios端无法访问接口 */</span></span>
<span class="line"><span> if(process.env.VUE_APP_ZLB_IS_ONLINE_ENV === &#39;false&#39;) mgopReceiceObj.header[&#39;isTestUrl&#39;] = &#39;1&#39;;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>说实话这种写法有些呆，但是缺乏相应的文档，也只能做到这种程度。</p><h4 id="取消请求" tabindex="-1">取消请求 <a class="header-anchor" href="#取消请求" aria-label="Permalink to &quot;取消请求&quot;">​</a></h4><p>Mgop 没有提供类似 Axios 中<code>cancelToken</code>或<code>AbortController</code>这种取消请求的能力，我的思路是给每个请求增加一个<code>uuid</code>，每次发送时将其<code>push</code>到一个数组中，当请求响应时判断是否在数组中。若在则正常响应，否则不接收响应的数据。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// 通过自定义的api，取消所有未完成请求</span></span>
<span class="line"><span>import useCostomApis from &#39;@/http/useCostomApis&#39;;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>const { cancel } = useCostomApis();</span></span>
<span class="line"><span>cancel()</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="埋点封装" tabindex="-1">埋点封装 <a class="header-anchor" href="#埋点封装" aria-label="Permalink to &quot;埋点封装&quot;">​</a></h3><h4 id="整体思路-1" tabindex="-1">整体思路 <a class="header-anchor" href="#整体思路-1" aria-label="Permalink to &quot;整体思路&quot;">​</a></h4><p>我司项目以 toG 为主，我也没有埋点的相关经验。如果只是为了通过浙里办的审核要求，还是挺简单的，只要把埋点必填参数都加上就好了，详情可见后续具体代码，这里主要再聊下我对浙里办这套埋点方案的思考。</p><p>先谈谈埋点代码的管理，在我看来好的埋点方案应当提供两种方案——既提供手动埋点，也提供自动埋点。我最初的设想是通过将信息放在路由的 meta 中判断是否进行要上报埋点，很遗憾由于必填参数<code>t2</code>、<code>t0</code>的存在，导致我最后没使用这套方案。现在的方案是在每个页面手动进行上报，这样的问题是写出了侵入式的代码，造成了埋点与业务代码之间的耦合。</p><p>再谈谈 PV 埋点参数获取，目前我的方案中这<code>t2</code>这个参数是不准确的。单页应用中，什么时候才是有效数据渲染完毕，这个点是比较复杂的。目前的改进方向通过<code>window.performance.getEntries()</code>来实现：</p><blockquote><ul><li><p>通过 window.performance.timing 所获的的页面渲染所相关的数据，在单页应用中改变了 url 但不刷新页面的情况下是不会更新的。因此如果仅仅通过该 api 是无法获得每一个子路由所对应的页面渲染的时间。如果需要上报切换路由情况下每一个子页面重新 render 的时间，需要自定义上报。</p></li><li><p>通过 window.performance.getEntries()所获取的资源加载和异步请求所相关的数据，在页面切换路由的时候会重新的计算，可以实现自动的上报。</p><p>——内容出自<a href="https://github.com/forthealllight/blog/issues/38" target="_blank" rel="noreferrer">《在单页应用中，如何优雅的上报前端性能数据》</a></p></li></ul></blockquote><p>不过话说回来，一个 H5 应用真的有必要做到这种程序吗，我觉得用户单位不会关心也不会使用这种数据。</p><h4 id="pv-埋点必填数据" tabindex="-1">PV 埋点必填数据 <a class="header-anchor" href="#pv-埋点必填数据" aria-label="Permalink to &quot;PV 埋点必填数据&quot;">​</a></h4><table><thead><tr><th>参数名</th><th>说明</th><th>示例</th><th><strong>备注</strong></th></tr></thead><tbody><tr><td>t2</td><td>页面加载时间</td><td>1.43（秒）</td><td>页面启动到加载完成</td></tr><tr><td>t0</td><td>页面响应时间</td><td>0.25（秒）</td><td>页面启动到页面响应</td></tr><tr><td>log_status</td><td>用户登录状态（01:未登录/02:单点登录）</td><td>02</td><td></td></tr><tr><td>miniAppId</td><td>应用开发管理</td><td></td><td>通过 IRS 应用发布界面获取服务唯一标识</td></tr><tr><td>miniAppName</td><td>应用开发管理平台应用名称</td><td></td><td>通过 IRS 应用发布界面获取服务名称</td></tr><tr><td>pageId</td><td>应用页面 ID</td><td></td><td>服务提供方统一规范各页面编号生成方式，服务内页面编号唯一即可，与服务埋点方案内页面编号可一一对应即可</td></tr><tr><td>pageName</td><td>应用页面名称</td><td></td><td>默认取页面 title，服务提供方自己定义，与服务埋点方案内名称一致即可</td></tr></tbody></table><h4 id="zwlog-初始化必填参数" tabindex="-1">zwlog 初始化必填参数 <a class="header-anchor" href="#zwlog-初始化必填参数" aria-label="Permalink to &quot;zwlog 初始化必填参数&quot;">​</a></h4><p>文档上没有说明必传，但是应用上架审核时会要求。</p><table><thead><tr><th>参数名</th><th>说明</th><th><strong>备注</strong></th></tr></thead><tbody><tr><td>_user_id</td><td>实际用户唯一识别 id</td><td>通过单点登录功能获取</td></tr><tr><td>_user_nick</td><td>实际用户名称</td><td>通过单点登录功能获取</td></tr></tbody></table><h4 id="具体代码-1" tabindex="-1">具体代码 <a class="header-anchor" href="#具体代码-1" aria-label="Permalink to &quot;具体代码&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// 在需要埋点的页面引入，必须在 setup 中使用</span></span>
<span class="line"><span>import useBuryingPoint from &quot;@/composables/useBuryingPoint&quot;;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>const { sendPageView } = useBuryingPoint();</span></span>
<span class="line"><span>sendPageView();</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// @/composables/useBuryingPoint.ts</span></span>
<span class="line"><span>import { computed, ComputedRef, ref, Ref, nextTick, watchEffect, onMounted } from &#39;vue&#39;;</span></span>
<span class="line"><span>import { useRoute } from &#39;vue-router&#39;;</span></span>
<span class="line"><span>import useSingleSignOn from &#39;./useSingleSignOn&#39;;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>interface ZwlogReceiveObj {</span></span>
<span class="line"><span>  _user_id?: string,</span></span>
<span class="line"><span>  _user_nick?: string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>enum LogStatus {</span></span>
<span class="line"><span>  Unlogged = &#39;01&#39;,</span></span>
<span class="line"><span>  Logged = &#39;02&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>interface PvReceiveObj {</span></span>
<span class="line"><span>  /** IRS 服务侧应用 appid */</span></span>
<span class="line"><span>  miniAppId: string,</span></span>
<span class="line"><span>  /** 页面启动到加载完成的时间 */</span></span>
<span class="line"><span>  t2: string | number,</span></span>
<span class="line"><span>  /** 页面启动到页面响应完成的时间 */</span></span>
<span class="line"><span>  t0: string | number,</span></span>
<span class="line"><span>  /** 各页面唯一标识 */</span></span>
<span class="line"><span>  pageId: string,</span></span>
<span class="line"><span>  /** 用户登录状态（01:未登录/ 02:单点登录） */</span></span>
<span class="line"><span>  log_status: LogStatus,</span></span>
<span class="line"><span>  /** 默认取页面 title，服务提供方自己定义，与服务埋点方案内名称一致即可 */</span></span>
<span class="line"><span>  pageName?: string,</span></span>
<span class="line"><span>  /** 用户从进入到离开当前页面的时长 */</span></span>
<span class="line"><span>  Page_duration?: string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>interface IZwlog {</span></span>
<span class="line"><span>  onReady: any,</span></span>
<span class="line"><span>  sendPV: (PvReceiveObj) =&gt; never</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const zwlog: Ref&lt;null | IZwlog&gt; = ref(null);</span></span>
<span class="line"><span>const currentRoutePath: Ref&lt;null | string&gt; = ref(null);</span></span>
<span class="line"><span>const isFirstComing = ref(true);</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>export default function useBuryingPoint() {</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 初始化 zwlog 方法</span></span>
<span class="line"><span>   * @param ZwlogReceiveObj - 接受用户唯一标识与用户昵称</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  function init(ZwlogReceiveObj: ZwlogReceiveObj = {}) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      // 在 d.ts 中声明ZwLog属于window，否则ts报错</span></span>
<span class="line"><span>      zwlog.value = new window.ZwLog(ZwlogReceiveObj);</span></span>
<span class="line"><span>      console.log(&#39;zwlog 初始化成功&#39;);</span></span>
<span class="line"><span>    } catch {</span></span>
<span class="line"><span>      throw new Error(&#39;zwlog 初始化失败&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 发送 PV 日志</span></span>
<span class="line"><span>   * @param miniAppId - IRS 服务侧应用 appid</span></span>
<span class="line"><span>   * @param t2 - 页面启动到加载完成的时间</span></span>
<span class="line"><span>   * @param t0 - 页面启动到页面响应完成的时间</span></span>
<span class="line"><span>   * @param pageId - 各页面唯一标识</span></span>
<span class="line"><span>   * @param pageName - 默认取页面 title，服务提供方自己定义，与服务埋点方案内名称一致即可</span></span>
<span class="line"><span>   * @param log_status - 用户登录状态（01:未登录/ 02:单点登录）</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>  function useSendPV(data: PvReceiveObj) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      if (zwlog.value === null) throw new Error(&#39;zwlog 未初始化&#39;);</span></span>
<span class="line"><span>      zwlog.value.onReady(function () {</span></span>
<span class="line"><span>        zwlog.value?.sendPV(data);</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    } catch (e: any) {</span></span>
<span class="line"><span>      throw new Error(\`useSendPV 方法错误:\${e?.message || e}\`);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 获取页面加载时间</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  function sendPageView() {</span></span>
<span class="line"><span>    const login = new Date().getTime();  //进入时间</span></span>
<span class="line"><span>    const upTime: any = ref(0);  //更新时间</span></span>
<span class="line"><span>    const beforeTime = ref(0);  //beforeUpdate</span></span>
<span class="line"><span>    //获取router--&gt;meta中设置的页面Id、Name</span></span>
<span class="line"><span>    const route = useRoute();</span></span>
<span class="line"><span>    const pageId = computed(() =&gt; route?.meta?.pageId ?? &#39;未定义的pageId&#39;) as ComputedRef&lt;string&gt;;</span></span>
<span class="line"><span>    const pageName = computed(() =&gt; route?.meta?.appTitle ?? process.env.VUE_APP_ZLB_TITLE) as ComputedRef&lt;string&gt;;</span></span>
<span class="line"><span>    const isAbleToSend = computed(() =&gt; currentRoutePath.value !== route?.fullPath);</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>    nextTick(() =&gt; {</span></span>
<span class="line"><span>      upTime.value = new Date().getTime();</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    onMounted(() =&gt; {</span></span>
<span class="line"><span>      beforeTime.value = new Date().getTime();</span></span>
<span class="line"><span>      currentRoutePath.value = route.fullPath;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    //监听时间，时间拿到之后调用pv发送日志</span></span>
<span class="line"><span>    watchEffect(() =&gt; {</span></span>
<span class="line"><span>      if (zwlog.value &amp;&amp; (isAbleToSend.value || isFirstComing.value) &amp;&amp; (beforeTime.value - login) &gt; 0 &amp;&amp; (upTime.value - login) &gt; 0) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          currentRoutePath.value = route.fullPath;</span></span>
<span class="line"><span>          isFirstComing.value = false;</span></span>
<span class="line"><span>          const { sso } = useSingleSignOn();</span></span>
<span class="line"><span>          const t0 = (beforeTime.value - login) / 1000;</span></span>
<span class="line"><span>          const t2 = (upTime.value - login) / 1000;</span></span>
<span class="line"><span>          const log_status = sso.status;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>          useSendPV({</span></span>
<span class="line"><span>            t2,</span></span>
<span class="line"><span>            t0,</span></span>
<span class="line"><span>            miniAppId: process.env.VUE_APP_ZLB_APP_ID,</span></span>
<span class="line"><span>            pageId: pageId.value,</span></span>
<span class="line"><span>            pageName: pageName.value,</span></span>
<span class="line"><span>            log_status</span></span>
<span class="line"><span>          });</span></span>
<span class="line"><span>          console.log(\`发送PV,t2:\${t2},t0:\${t0},pageId:\${pageId.value},pageName:\${pageName.value},log_status:\${log_status}\`);</span></span>
<span class="line"><span>        } catch (e: any) {</span></span>
<span class="line"><span>          console.error(\`发送PV失败：\${e.message}\`);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    zwlog,</span></span>
<span class="line"><span>    init,</span></span>
<span class="line"><span>    useSendPV,</span></span>
<span class="line"><span>    sendPageView</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br></div></div><h3 id="部署" tabindex="-1">部署 <a class="header-anchor" href="#部署" aria-label="Permalink to &quot;部署&quot;">​</a></h3><h4 id="如何部署" tabindex="-1">如何部署 <a class="header-anchor" href="#如何部署" aria-label="Permalink to &quot;如何部署&quot;">​</a></h4><p>将<code>git</code>与<code>node_modules</code>之外的代码添加到压缩文件，通过 IRS 上传，平台会自动进行解压、编译、部署。</p><h4 id="部署报错-构建产物存放路径-build-不存在" tabindex="-1">部署报错“构建产物存放路径 build 不存在” <a class="header-anchor" href="#部署报错-构建产物存放路径-build-不存在" aria-label="Permalink to &quot;部署报错“构建产物存放路径 build 不存在”&quot;">​</a></h4><p>浙里办强制要求打包产物名称为“build”，修改打包名称后重新部署。</p><h4 id="同样的包之前部署成功-现在却编译失败" tabindex="-1">同样的包之前部署成功，现在却编译失败 <a class="header-anchor" href="#同样的包之前部署成功-现在却编译失败" aria-label="Permalink to &quot;同样的包之前部署成功，现在却编译失败&quot;">​</a></h4><p>就是浙里办的 BUG，但反馈也没用。重新部署，还不行只能提工单。</p><h3 id="环境变量管理" tabindex="-1">环境变量管理 <a class="header-anchor" href="#环境变量管理" aria-label="Permalink to &quot;环境变量管理&quot;">​</a></h3><h4 id="整体思路-2" tabindex="-1">整体思路 <a class="header-anchor" href="#整体思路-2" aria-label="Permalink to &quot;整体思路&quot;">​</a></h4><p>本项目使用<code>dotenv</code>实现环境变量，相较于一般项目，本项目复杂的点在于：不仅有本地开发环境与线上环境的差异，线上环境还有生产环境与测试环境之分。生产环境与测试环境的单点登录回调地址参数不同；测试、生产环境即可以访问生产地址的接口，也可以访问联调接口。</p><p>由于每次只能通过上传压缩包的方式部署，每次切换 mgop 的生产环境与联调环境必须手动修改。本项目中当<code>VUE_APP_ZLB_IS_ONLINE_ENV</code>为<code>&#39;false&#39;</code>时代表要发布测试环境，否则代表访问线上环境。</p><h4 id="具体代码-2" tabindex="-1">具体代码 <a class="header-anchor" href="#具体代码-2" aria-label="Permalink to &quot;具体代码&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// .env</span></span>
<span class="line"><span>NODE_ENV = development</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span># axios 相关</span></span>
<span class="line"><span>VUE_APP_BASE_URL = 开发环境联调地址</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span># 浙里办相关</span></span>
<span class="line"><span>VUE_APP_ZLB_TITLE = 自定义应用名称</span></span>
<span class="line"><span>VUE_APP_ZLB_APP_ID = 应用唯一标识（单点登录、埋点相关）</span></span>
<span class="line"><span>VUE_APP_ZLB_APP_KEY = 标示请求应用（可以通过应用开放平台获取，mgop相关）</span></span>
<span class="line"><span>VUE_APP_ZLB_ACCESS_KEY = 单点登录组件AK（SK不要存在前端项目中，会造成泄露）</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span># 是否发布正式版，false 时为测试版，其他值时为正式版</span></span>
<span class="line"><span># 请勿直接修改当前文件，修改 .env.production 文件</span></span>
<span class="line"><span>VUE_APP_ZLB_IS_ONLINE_ENV = false</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// .env.production</span></span>
<span class="line"><span>NODE_ENV = production</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>VUE_APP_ZLB_IS_ONLINE_ENV = false</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span> // package.json</span></span>
<span class="line"><span></span></span>
<span class="line"><span> &quot;scripts&quot;: {</span></span>
<span class="line"><span>    &quot;build&quot;: &quot;vue-cli-service build --mode production&quot;,</span></span>
<span class="line"><span>  },</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="适老化" tabindex="-1">适老化 <a class="header-anchor" href="#适老化" aria-label="Permalink to &quot;适老化&quot;">​</a></h3><h4 id="整体思路-3" tabindex="-1">整体思路 <a class="header-anchor" href="#整体思路-3" aria-label="Permalink to &quot;整体思路&quot;">​</a></h4><p>本质是做一套换肤方案，通过<code>ZWJSBridge.getUiStyle</code>这个 api 可以获取用户当前风格(<code>normal</code>、<code>elder</code>)，并在每次初始化应用时获取当前风格，保存至 pinia 中的<code>uiStyle</code>。当风格为<code>elder</code>时展示界面为长辈版。</p><p>我的方案比较质朴，准备两套样式方案，通过控制<code>App.vue</code>最外层的 class 来切换一般组件样式。粗粒度的组件直接通过改变 CSS 变量即可。对于一些有细粒度要求的组件即可以通过<code>uiStyle</code>这个变量控制，也可以增加<code>elder-oriented-theme</code>这个类下的组件样式。</p><p>此外，我看到有人通过 REM 适配的适老化方案是直接增加根元素字体大小，这种方案局限性过大，无法做到细粒度的样式切换。</p><h4 id="具体代码-3" tabindex="-1">具体代码 <a class="header-anchor" href="#具体代码-3" aria-label="Permalink to &quot;具体代码&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// App.vue</span></span>
<span class="line"><span>&lt;div class=&quot;elder-container&quot; :class=&quot;{ &#39;elder-oriented-theme&#39;: userStore.isElderlyOrientedMode }&quot;&gt;</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>&lt;/div&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// pinia</span></span>
<span class="line"><span>export const useUserStore = defineStore(&quot;user&quot;, {</span></span>
<span class="line"><span>  persist: false,</span></span>
<span class="line"><span>  state: () =&gt; {</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      uiStyle: &quot;normal&quot;, // elder normal</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  getters: {</span></span>
<span class="line"><span>    isElderlyOrientedMode: (state) =&gt;</span></span>
<span class="line"><span>      state.uiStyle === &quot;elder&quot; ? true : false</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// css变量</span></span>
<span class="line"><span>/** 普通版变量 */</span></span>
<span class="line"><span>:root {</span></span>
<span class="line"><span>    /** 颜色变量 */</span></span>
<span class="line"><span>    /** 主题色 */</span></span>
<span class="line"><span>    --qkh-theme-color: #469afd;</span></span>
<span class="line"><span>    /** 文本颜色 */</span></span>
<span class="line"><span>    --qkh-text-color: #333;</span></span>
<span class="line"><span>    /** 弱化文本颜色 */</span></span>
<span class="line"><span>    --qkh-weak-text-color: #848689;</span></span>
<span class="line"><span>    /** 文本辅助色 */</span></span>
<span class="line"><span>    --qkh-adjuvant-text-color: #6377f5;</span></span>
<span class="line"><span>    /** 界面色 */</span></span>
<span class="line"><span>    --qkh-ui-color: #fff;</span></span>
<span class="line"><span>    /** 页面背景色 */</span></span>
<span class="line"><span>    --qkh-background-color: #f9f9ff;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>    /** 字体变量 */</span></span>
<span class="line"><span>    /** 首页标题 */</span></span>
<span class="line"><span>    --qkh-home-title-font: bold 20px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    /** 一级标题 */</span></span>
<span class="line"><span>    --qkh-primary-title-font: 18px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    /** 二级标题 */</span></span>
<span class="line"><span>    --qkh-secondary-title-font: 16px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    /** 正文 */</span></span>
<span class="line"><span>    --qkh-text-font: 14px Alibaba-PuHuiTi-R, Alibaba-PuHuiTi, Droid Sans Fallback;</span></span>
<span class="line"><span>    /** 补充说明 */</span></span>
<span class="line"><span>    --qkh-additional-instruction-font: 12px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    /** 辅助文字 */</span></span>
<span class="line"><span>    --qkh-auxiliary-text-font: 10px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>/** 适老化变量 */</span></span>
<span class="line"><span>.elder-oriented-theme {</span></span>
<span class="line"><span>    --qkh-home-title-font: 20px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    --qkh-primary-title-font: 20px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    --qkh-secondary-title-font: 20px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    --qkh-text-font: 20px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    --qkh-additional-instruction-font: 18px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>    --qkh-auxiliary-text-font: 16px -apple-system, Helvetica, sans-serif;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>​</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br></div></div><h3 id="调试" tabindex="-1">调试 <a class="header-anchor" href="#调试" aria-label="Permalink to &quot;调试&quot;">​</a></h3><h4 id="整体思路-4" tabindex="-1">整体思路 <a class="header-anchor" href="#整体思路-4" aria-label="Permalink to &quot;整体思路&quot;">​</a></h4><p>浙里办调试主要通过两种方式：</p><ul><li>Debug 中台工具</li><li>控制台按钮</li></ul><p>浙里办本身也提供了显示控制台按钮的能力，但是我嫌麻烦直接自己在项目中引入了<code>vConsole</code>。</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// main.ts</span></span>
<span class="line"><span>import VConsole from &quot;vconsole&quot;;</span></span>
<span class="line"><span>const vConsole = new VConsole();</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="按需显示-vconsole" tabindex="-1">按需显示 vConsole <a class="header-anchor" href="#按需显示-vconsole" aria-label="Permalink to &quot;按需显示 vConsole&quot;">​</a></h4><p>如果直接在<code>main.ts</code>中引入的话，每次部署到线上环境还要手动把 vConsole 代码给注掉，容易出错。前面提过了当<code>ZLB_IS_ONLINE_ENV</code>这个变量值为<code>false</code>时代表要部署到测试环境，那么可以根据这个值判断是否要显示 vConsole，具体代码如下：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// vue.config.js</span></span>
<span class="line"><span>const { defineConfig } = require(&quot;@vue/cli-service&quot;);</span></span>
<span class="line"><span>const vConsolePlugin = require(&#39;vconsole-webpack-plugin&#39;);</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>module.exports = defineConfig({</span></span>
<span class="line"><span>  configureWebpack: {</span></span>
<span class="line"><span>    plugins: [</span></span>
<span class="line"><span>      /** 配置是否需要 vConsole */</span></span>
<span class="line"><span>      new vConsolePlugin({</span></span>
<span class="line"><span>        enable: process.env.VUE_APP_ZLB_IS_ONLINE_ENV === &#39;false&#39;</span></span>
<span class="line"><span>      })</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h2 id="h5-相关" tabindex="-1">H5 相关 <a class="header-anchor" href="#h5-相关" aria-label="Permalink to &quot;H5 相关&quot;">​</a></h2><h3 id="babel-配置支持-es2020" tabindex="-1">babel 配置支持 ES2020 <a class="header-anchor" href="#babel-配置支持-es2020" aria-label="Permalink to &quot;babel 配置支持 ES2020&quot;">​</a></h3><p>浙里办技术支持的说法是浙里办的 node 版本是 14，但我实测例如<code>可选链</code>、<code>空值合并运算符</code>等 ES2020 并不能使用，我的 babel 配置如下：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// babel.config.js</span></span>
<span class="line"><span>module.exports = {</span></span>
<span class="line"><span>  presets: [</span></span>
<span class="line"><span>    [&quot;@vue/cli-plugin-babel/preset&quot;, {</span></span>
<span class="line"><span>      targets: {</span></span>
<span class="line"><span>        chrome: 59,</span></span>
<span class="line"><span>        edge: 13,</span></span>
<span class="line"><span>        firefox: 50,</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>    }]</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="业务需求" tabindex="-1">业务需求 <a class="header-anchor" href="#业务需求" aria-label="Permalink to &quot;业务需求&quot;">​</a></h2><h3 id="文件上传" tabindex="-1">文件上传 <a class="header-anchor" href="#文件上传" aria-label="Permalink to &quot;文件上传&quot;">​</a></h3><h4 id="json-入参转文件流" tabindex="-1">JSON 入参转文件流 <a class="header-anchor" href="#json-入参转文件流" aria-label="Permalink to &quot;JSON 入参转文件流&quot;">​</a></h4><p>平时的文件上传都是通过流来实现。由于浙里办的规范——接口入参出参只接受 JSON，只能曲线救国，JSON 入参，再由后端转换成需要的格式。此种方案优缺点如下：</p><p><strong>优点：</strong> 实现起来简单。</p><p><strong>缺点：</strong> 是接口响应速度会变慢。</p><h4 id="使用-oss" tabindex="-1">使用 OSS <a class="header-anchor" href="#使用-oss" aria-label="Permalink to &quot;使用 OSS&quot;">​</a></h4><p>阿里云对象存储 OSS（Object Storage Service），是由阿里提供的一种云存储服务。</p><p>此种方案优缺点如下：</p><p><strong>优点：</strong> 提交材料审核时，这部分无需额外的说明。</p><p><strong>缺点：</strong> 需要付费。</p><p>具体使用前后端需集成相应的 SDK，我司项目中后端使用<a href="https://help.aliyun.com/document_detail/32007.html" target="_blank" rel="noreferrer">Java</a>，前端使用<a href="https://help.aliyun.com/document_detail/64041.html" target="_blank" rel="noreferrer">Browser.js</a>。</p><p>大致流程是需要后端提供一个接口用于<a href="https://help.aliyun.com/document_detail/100624.html" target="_blank" rel="noreferrer">使用 STS 临时访问凭证访问 OSS</a>，获取凭证后前端初始化 OSS，然后就可以进行上传下载等权限内操作。</p><p>需要注意的是，OSS 有有效时间，快到期前需要刷新凭证。一开始我是使用<code>refreshSTSToken</code>这个官方提供的参数进行刷新，但是后来我发现每次调用<code>signatureUrl</code>这个方法都会触发<code>refreshSTSToken</code>。在社区提了个 ISSUE：<a href="https://github.com/ali-sdk/ali-oss/issues/1178" target="_blank" rel="noreferrer">v6.17.1 browserjs 调用 signatureUrl 方法会触发 refreshSTSToken</a>，但是快一个月过去了也无人回应，后面索性就直接写个定时任务来刷新了。</p><p>此处不对 OSS 进行过多的展开，更多请见<a href="https://help.aliyun.com/document_detail/31817.html#:~:text=OSS%E7%9B%B8%E5%85%B3%E6%A6%82%E5%BF%B5.%20%E5%AD%98%E5%82%A8%E7%B1%BB%E5%9E%8B%EF%BC%88Storage%20Class%EF%BC%89.%20OSS%E6%8F%90%E4%BE%9B%E6%A0%87%E5%87%86%E3%80%81%E4%BD%8E%E9%A2%91%E8%AE%BF%E9%97%AE%E3%80%81%E5%BD%92%E6%A1%A3%E3%80%81%E5%86%B7%E5%BD%92%E6%A1%A3%E5%9B%9B%E7%A7%8D%E5%AD%98%E5%82%A8%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%85%A8%E9%9D%A2%E8%A6%86%E7%9B%96%E4%BB%8E%E7%83%AD%E5%88%B0%E5%86%B7%E7%9A%84%E5%90%84%E7%A7%8D%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8%E5%9C%BA%E6%99%AF%E3%80%82.,%E5%85%B6%E4%B8%AD%E6%A0%87%E5%87%86%E5%AD%98%E5%82%A8%E7%B1%BB%E5%9E%8B%E6%8F%90%E4%BE%9B%E9%AB%98%E6%8C%81%E4%B9%85%E3%80%81%E9%AB%98%E5%8F%AF%E7%94%A8%E3%80%81%E9%AB%98%E6%80%A7%E8%83%BD%E7%9A%84%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E6%9C%8D%E5%8A%A1%EF%BC%8C%E8%83%BD%E5%A4%9F%E6%94%AF%E6%8C%81%E9%A2%91%E7%B9%81%E7%9A%84%E6%95%B0%E6%8D%AE%E8%AE%BF%E9%97%AE%EF%BC%9B%E4%BD%8E%E9%A2%91%E8%AE%BF%E9%97%AE%E5%AD%98%E5%82%A8%E7%B1%BB%E5%9E%8B%E9%80%82%E5%90%88%E9%95%BF%E6%9C%9F%E4%BF%9D%E5%AD%98%E4%B8%8D%E7%BB%8F%E5%B8%B8%E8%AE%BF%E9%97%AE%E7%9A%84%E6%95%B0%E6%8D%AE%EF%BC%88%E5%B9%B3%E5%9D%87%E6%AF%8F%E6%9C%88%E8%AE%BF%E9%97%AE%E9%A2%91%E7%8E%871%E5%88%B02%E6%AC%A1%EF%BC%89%EF%BC%8C%E5%AD%98%E5%82%A8%E5%8D%95%E4%BB%B7%E4%BD%8E%E4%BA%8E%E6%A0%87%E5%87%86%E7%B1%BB%E5%9E%8B%EF%BC%9B%E5%BD%92%E6%A1%A3%E5%AD%98%E5%82%A8%E7%B1%BB%E5%9E%8B%E9%80%82%E5%90%88%E9%9C%80%E8%A6%81%E9%95%BF%E6%9C%9F%E4%BF%9D%E5%AD%98%EF%BC%88%E5%BB%BA%E8%AE%AE%E5%8D%8A%E5%B9%B4%E4%BB%A5%E4%B8%8A%EF%BC%89%E7%9A%84%E5%BD%92%E6%A1%A3%E6%95%B0%E6%8D%AE%EF%BC%9B%E5%86%B7%E5%BD%92%E6%A1%A3%E5%AD%98%E5%82%A8%E9%80%82%E5%90%88%E9%9C%80%E8%A6%81%E8%B6%85%E9%95%BF%E6%97%B6%E9%97%B4%E5%AD%98%E6%94%BE%E7%9A%84%E6%9E%81%E5%86%B7%E6%95%B0%E6%8D%AE%E3%80%82.%20%E6%9B%B4%E5%A4%9A%E4%BF%A1%E6%81%AF%EF%BC%8C%E8%AF%B7%E5%8F%82%E8%A7%81%20%E5%AD%98%E5%82%A8%E7%B1%BB%E5%9E%8B%E4%BB%8B%E7%BB%8D%20%E3%80%82." target="_blank" rel="noreferrer">《什么是对象存储 OSS》</a>。</p><p>具体代码如下：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>// 具体使用</span></span>
<span class="line"><span>import useOss from &#39;@/composables/useOss&#39;;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>// 初始化</span></span>
<span class="line"><span>const { init: initOss } = useOss();</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>// 文件上传</span></span>
<span class="line"><span>const { putObject } = useOss();</span></span>
<span class="line"><span>putObject(自定义文件对象, 文件名);</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>// 由加密后的数据，获 取文件地址</span></span>
<span class="line"><span>const { getPreviewUrl } = useOss();</span></span>
<span class="line"><span>const filePath = getPreviewUrl(加密后的数据)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>// @/composables/useOss.ts</span></span>
<span class="line"><span>import OSS from &#39;ali-oss&#39;;</span></span>
<span class="line"><span>import { getOssSts } from &#39;@/apis/file&#39;;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @param region 填写Bucket所在地域。以华东1（杭州）为例，填写为oss-cn-hangzhou</span></span>
<span class="line"><span> * @param accessKeyId  从STS服务获取的临时访问密钥 AccessKey ID</span></span>
<span class="line"><span> * @param accessKeySecret 从STS服务获取的临时访问密钥 AccessKey Secret</span></span>
<span class="line"><span> * @param stsToken 从STS服务获取的安全令牌（SecurityToken）</span></span>
<span class="line"><span> * @param bucket Bucket名称</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>const headers = {</span></span>
<span class="line"><span>    // 指定该Object被下载时网页的缓存行为。</span></span>
<span class="line"><span>    // &#39;Cache-Control&#39;: &#39;no-cache&#39;,</span></span>
<span class="line"><span>    // 指定该Object被下载时的名称。</span></span>
<span class="line"><span>    // &#39;Content-Disposition&#39;: &#39;oss_download.txt&#39;,</span></span>
<span class="line"><span>    // 指定该Object被下载时的内容编码格式。</span></span>
<span class="line"><span>    // &#39;Content-Encoding&#39;: &#39;UTF-8&#39;,</span></span>
<span class="line"><span>    // 指定过期时间。</span></span>
<span class="line"><span>    // &#39;Expires&#39;: &#39;Wed, 08 Jul 2022 16:57:01 GMT&#39;,</span></span>
<span class="line"><span>    // 指定Object的存储类型。</span></span>
<span class="line"><span>    // &#39;x-oss-storage-class&#39;: &#39;Standard&#39;,</span></span>
<span class="line"><span>    // 指定Object的访问权限。</span></span>
<span class="line"><span>    // &#39;x-oss-object-acl&#39;: &#39;private&#39;,</span></span>
<span class="line"><span>    // 设置Object的标签，可同时设置多个标签。</span></span>
<span class="line"><span>    // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。</span></span>
<span class="line"><span>    &#39;x-oss-forbid-overwrite&#39;: &#39;true&#39;,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>let client: any = null;</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>export default function useOss() {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * oss 初始化方法</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    async function init() {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            const { data: refreshToken }: any = await getOssSts();</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>            client = new OSS({</span></span>
<span class="line"><span>                region: process.env.VUE_APP_OSS_REGION,</span></span>
<span class="line"><span>                accessKeyId: refreshToken.AccessKeyId,</span></span>
<span class="line"><span>                accessKeySecret: refreshToken.AccessKeySecret,</span></span>
<span class="line"><span>                stsToken: refreshToken.SecurityToken,</span></span>
<span class="line"><span>                // refreshSTSToken 有BUG放弃使用</span></span>
<span class="line"><span>                // refreshSTSToken: async () =&gt; {</span></span>
<span class="line"><span>                //     // 向您搭建的STS服务获取临时访问凭证。</span></span>
<span class="line"><span>                //     const { data: refreshToken }: any = await getOssSts();</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>                //     return {</span></span>
<span class="line"><span>                //         accessKeyId: refreshToken.AccessKeyId,</span></span>
<span class="line"><span>                //         accessKeySecret: refreshToken.AccessKeySecret,</span></span>
<span class="line"><span>                //         stsToken: refreshToken.SecurityToken,</span></span>
<span class="line"><span>                //     };</span></span>
<span class="line"><span>                // },</span></span>
<span class="line"><span>                // // 刷新临时访问凭证的时间间隔，单位为毫秒。</span></span>
<span class="line"><span>                // refreshSTSTokenInterval: 60000 * 30,</span></span>
<span class="line"><span>                bucket: process.env.VUE_APP_OSS_BUCKET,</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>            console.log(&#39;OSS 访问凭证初始化成功&#39;);</span></span>
<span class="line"><span>        } catch (e: any) {</span></span>
<span class="line"><span>            throw new Error(\`OSS 访问凭证初始化失败：\${e.message}\`);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * OSS 上传文件,填写Object完整路径。Object完整路径中不能包含Bucket名称。您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。</span></span>
<span class="line"><span>     * @param data - data对象可以自定义为file对象、Blob数据或者OSS Buffer</span></span>
<span class="line"><span>     * @param filename - 文件名，需要带上文件后缀</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    async function putObject(data, filename) {</span></span>
<span class="line"><span>        if (client === null) return console.error(&#39;oss client 未初始化&#39;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            const result = await client.put(</span></span>
<span class="line"><span>                filename, data, headers);</span></span>
<span class="line"><span>            return result;</span></span>
<span class="line"><span>        } catch (e) {</span></span>
<span class="line"><span>            throw new Error(\`文件流上传 OSS 失败，\${e}\`);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * @abstract 获取文件预览地址</span></span>
<span class="line"><span>     * @param filePath bucket上的文件名</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    function getPreviewUrl(filePath: string) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            if (client === null) {</span></span>
<span class="line"><span>                console.error(&#39;oss client 未初始化&#39;);</span></span>
<span class="line"><span>            } else if (!filePath) {</span></span>
<span class="line"><span>                console.warn(&#39;oss 获取地址为空&#39;);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                const url = client.signatureUrl(filePath);</span></span>
<span class="line"><span>                return url;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return &#39;&#39;;</span></span>
<span class="line"><span>        } catch (e) {</span></span>
<span class="line"><span>            console.error(\`获取文件预览地址失败，\${e}\`);</span></span>
<span class="line"><span>            return &#39;&#39;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>​</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>        putObject,</span></span>
<span class="line"><span>        getPreviewUrl,</span></span>
<span class="line"><span>        init</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br></div></div><h3 id="扫码签到" tabindex="-1">扫码签到 <a class="header-anchor" href="#扫码签到" aria-label="Permalink to &quot;扫码签到&quot;">​</a></h3><p>最终实现的效果是同一个二维码（自己生成）通过浙里办扫码会进入应用，通过微应用再次扫码执行签到的业务逻辑。</p><p>二维码的内容是<strong>应用的地址拼接上额外的参数</strong>，由于进入应用后要进行单点登录流程，应用地址会被重定向（由浙里办配置的回调地址决定），因此不能通过应用的<code>url</code>获取自定义的信息，必须再次扫码。具体的使用浙里办扫一扫 api 并签到的代码如下：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>  function scanQrcodeToSignIn(): Promise&lt;IScanResponse&gt; {</span></span>
<span class="line"><span>    return new Promise((resolve, reject) =&gt; {</span></span>
<span class="line"><span>      ZWJSBridge.scan({</span></span>
<span class="line"><span>        type: &quot;qrCode&quot;</span></span>
<span class="line"><span>      })</span></span>
<span class="line"><span>        .then((result) =&gt; {</span></span>
<span class="line"><span>          const { text } = result;</span></span>
<span class="line"><span>          // ... 具体的业务逻辑省略</span></span>
<span class="line"><span>          if (拿到想要的信息) {</span></span>
<span class="line"><span>            resolve(需要的信息);</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            reject(new Error(&#39;请扫描签到的二维码&#39;));</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>        .catch((e: any) =&gt; {</span></span>
<span class="line"><span>          /** IOS 用户取消时会抛出异常；handleException是我自定义的异常类 */</span></span>
<span class="line"><span>          if (e?.errorMessage !== &#39;用户取消&#39;) reject(new Error(\`唤起扫一扫失败:\${e?.message ?? handleException(e)}\`));</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  };</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h2 id="一些开发文档" tabindex="-1">一些开发文档 <a class="header-anchor" href="#一些开发文档" aria-label="Permalink to &quot;一些开发文档&quot;">​</a></h2><p><a href="https://github.com/ivestszheng/zwjsbridge-docs" target="_blank" rel="noreferrer">zwjsbridge-docs</a></p><h2 id="一些可能需要用到的能力实现" tabindex="-1">一些可能需要用到的能力实现 <a class="header-anchor" href="#一些可能需要用到的能力实现" aria-label="Permalink to &quot;一些可能需要用到的能力实现&quot;">​</a></h2><p><a href="https://github.com/ivestszheng/zlb-vue3-demo" target="_blank" rel="noreferrer">zlb-vue3-demo</a></p><h2 id="线上应用" tabindex="-1">线上应用 <a class="header-anchor" href="#线上应用" aria-label="Permalink to &quot;线上应用&quot;">​</a></h2><p>浙里办搜索 <strong>【青科汇】</strong>，另外同事用 Vue2 开发的应用可查看 <strong>【浙里科普】</strong>。</p>`,156),r=[l];function i(c,t,b,o,u,m){return n(),a("div",null,r)}const g=s(e,[["render",i]]);export{h as __pageData,g as default};
