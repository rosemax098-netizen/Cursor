// 苹果风格PPT - 主要交互逻辑

class ApplePPT {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 8;
        this.isTransitioning = false;
        this.animationDuration = 600; // 毫秒
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
        this.addSlideAnimations();
        this.preloadContent();
    }
    
    // 绑定所有事件监听器
    bindEvents() {
        // 键盘导航
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // 侧边导航按钮
        document.getElementById('prevButton').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextButton').addEventListener('click', () => this.nextSlide());
        
        // 底部控制按钮
        document.getElementById('prevBottomButton').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextBottomButton').addEventListener('click', () => this.nextSlide());
        
        // 页码指示器
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index + 1));
        });
        
        // 触摸手势支持
        this.addTouchSupport();
        
        // 鼠标滚轮支持
        this.addWheelSupport();
        
        // 窗口调整大小事件
        window.addEventListener('resize', () => this.handleResize());
        
        // 可见性变化事件（用于暂停/恢复动画）
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    // 键盘事件处理
    handleKeydown(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.exitFullscreen();
                break;
            case 'f':
            case 'F11':
                if (e.key === 'f') {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
                break;
        }
    }
    
    // 触摸手势支持
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const container = document.querySelector('.ppt-container');
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // 确保是水平滑动而不是垂直滑动
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }
    
    // 鼠标滚轮支持
    addWheelSupport() {
        let wheelTimeout;
        const container = document.querySelector('.ppt-container');
        
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // 防抖处理，避免过快滚动
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }, 100);
        }, { passive: false });
    }
    
    // 下一张幻灯片
    nextSlide() {
        if (this.currentSlide < this.totalSlides && !this.isTransitioning) {
            this.goToSlide(this.currentSlide + 1, 'next');
        }
    }
    
    // 上一张幻灯片
    previousSlide() {
        if (this.currentSlide > 1 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide - 1, 'prev');
        }
    }
    
    // 跳转到指定幻灯片
    goToSlide(slideNumber, direction = 'fade') {
        if (slideNumber === this.currentSlide || this.isTransitioning) return;
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.isTransitioning = true;
        
        const currentSlideElement = document.querySelector('.slide.active');
        const nextSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
        
        if (!nextSlideElement) return;
        
        // 添加过渡动画类
        this.applyTransitionAnimation(currentSlideElement, nextSlideElement, direction);
        
        // 更新当前幻灯片索引
        this.currentSlide = slideNumber;
        
        // 更新UI状态
        setTimeout(() => {
            this.updateUI();
            this.triggerSlideAnimations(nextSlideElement);
            this.isTransitioning = false;
        }, this.animationDuration);
        
        // 发送自定义事件
        this.dispatchSlideChangeEvent(slideNumber);
    }
    
    // 应用过渡动画
    applyTransitionAnimation(currentSlide, nextSlide, direction) {
        // 移除当前活动状态
        currentSlide.classList.remove('active');
        
        // 根据方向应用不同的动画
        nextSlide.style.visibility = 'visible';
        nextSlide.style.opacity = '0';
        
        // 强制重排
        nextSlide.offsetHeight;
        
        // 应用动画类
        switch(direction) {
            case 'next':
                nextSlide.classList.add('slide-transition-next');
                break;
            case 'prev':
                nextSlide.classList.add('slide-transition-prev');
                break;
            default:
                nextSlide.classList.add('slide-transition-fade');
        }
        
        // 设置新的活动幻灯片
        setTimeout(() => {
            nextSlide.classList.add('active');
            nextSlide.style.opacity = '1';
            
            // 清理动画类
            nextSlide.classList.remove('slide-transition-next', 'slide-transition-prev', 'slide-transition-fade');
        }, 50);
    }
    
    // 更新UI状态
    updateUI() {
        // 更新页码指示器
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 === this.currentSlide);
        });
        
        // 更新控制按钮状态
        const prevButtons = [
            document.getElementById('prevButton'),
            document.getElementById('prevBottomButton')
        ];
        const nextButtons = [
            document.getElementById('nextButton'),
            document.getElementById('nextBottomButton')
        ];
        
        prevButtons.forEach(btn => {
            btn.disabled = this.currentSlide <= 1;
            btn.setAttribute('aria-disabled', this.currentSlide <= 1);
        });
        
        nextButtons.forEach(btn => {
            btn.disabled = this.currentSlide >= this.totalSlides;
            btn.setAttribute('aria-disabled', this.currentSlide >= this.totalSlides);
        });
        
        // 更新页码显示
        document.getElementById('currentSlide').textContent = this.currentSlide;
        document.getElementById('totalSlides').textContent = this.totalSlides;
        
        // 更新页面标题
        document.title = `苹果风格PPT - ${this.currentSlide}/${this.totalSlides}`;
    }
    
    // 为幻灯片内容添加进入动画
    addSlideAnimations() {
        document.querySelectorAll('.slide').forEach((slide, slideIndex) => {
            const elements = slide.querySelectorAll('h1, h2, h3, p, .principle-card, .color-item, .typography-item, .apple-button, .info-box, .checklist-item');
            
            elements.forEach((element, elementIndex) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.transitionDelay = `${elementIndex * 0.1}s`;
            });
        });
    }
    
    // 触发幻灯片动画
    triggerSlideAnimations(slideElement) {
        const elements = slideElement.querySelectorAll('h1, h2, h3, p, .principle-card, .color-item, .typography-item, .apple-button, .info-box, .checklist-item');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // 预加载内容
    preloadContent() {
        // 预加载图片
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        
        // 预加载字体
        this.preloadFonts();
    }
    
    // 预加载字体
    preloadFonts() {
        const fonts = [
            'SF Pro Display',
            'SF Pro Text',
            'Helvetica Neue'
        ];
        
        fonts.forEach(font => {
            const fontLoad = new FontFace(font, `local(${font})`);
            fontLoad.load().catch(() => {
                console.log(`Font ${font} not available, using fallback`);
            });
        });
    }
    
    // 全屏控制
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    // 窗口调整大小处理
    handleResize() {
        // 重新计算布局
        const container = document.querySelector('.ppt-container');
        const containerRect = container.getBoundingClientRect();
        
        // 确保16:9比例
        const aspectRatio = 16 / 9;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let newWidth, newHeight;
        
        if (windowWidth / windowHeight > aspectRatio) {
            newHeight = windowHeight * 0.9;
            newWidth = newHeight * aspectRatio;
        } else {
            newWidth = windowWidth * 0.9;
            newHeight = newWidth / aspectRatio;
        }
        
        container.style.width = `${newWidth}px`;
        container.style.height = `${newHeight}px`;
    }
    
    // 可见性变化处理
    handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏时暂停动画
            document.body.classList.add('paused');
        } else {
            // 页面显示时恢复动画
            document.body.classList.remove('paused');
        }
    }
    
    // 发送幻灯片变化事件
    dispatchSlideChangeEvent(slideNumber) {
        const event = new CustomEvent('slidechange', {
            detail: {
                currentSlide: slideNumber,
                totalSlides: this.totalSlides,
                direction: slideNumber > this.currentSlide ? 'next' : 'prev'
            }
        });
        document.dispatchEvent(event);
    }
    
    // 公共API方法
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    isTransitionInProgress() {
        return this.isTransitioning;
    }
    
    // 自动播放功能
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.stopAutoPlay();
            }
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // 销毁实例
    destroy() {
        this.stopAutoPlay();
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// 工具函数
const PPTUtils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 检测设备类型
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // 检测是否支持触摸
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    },
    
    // 获取设备像素比
    getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    }
};

// 初始化PPT
document.addEventListener('DOMContentLoaded', () => {
    window.ppt = new ApplePPT();
    
    // 监听幻灯片变化事件
    document.addEventListener('slidechange', (e) => {
        console.log(`Slide changed to: ${e.detail.currentSlide}`);
        
        // 可以在这里添加页面特定的逻辑
        const slideElement = document.querySelector(`[data-slide="${e.detail.currentSlide}"]`);
        const slideType = slideElement.dataset.slideType || 'default';
        
        // 根据幻灯片类型执行特定操作
        switch(slideType) {
            case 'title':
                // 标题页特殊处理
                break;
            case 'content':
                // 内容页特殊处理
                break;
            default:
                break;
        }
    });
    
    // 添加键盘快捷键提示
    if (!PPTUtils.isMobile()) {
        console.log('键盘快捷键:');
        console.log('← / → : 上一页 / 下一页');
        console.log('Space / PageDown : 下一页');
        console.log('PageUp : 上一页');
        console.log('Home : 第一页');
        console.log('End : 最后一页');
        console.log('F : 全屏切换');
        console.log('Esc : 退出全屏');
    }
});

// 导出到全局作用域
window.ApplePPT = ApplePPT;
window.PPTUtils = PPTUtils;