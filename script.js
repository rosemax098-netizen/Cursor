// 苹果风格PPT交互脚本

class ApplePPT {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 6;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateButtons();
        this.preloadAnimations();
    }

    bindEvents() {
        // 底部导航按钮
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());
        
        // 侧边导航按钮
        document.getElementById('leftNav').addEventListener('click', () => this.prevSlide());
        document.getElementById('rightNav').addEventListener('click', () => this.nextSlide());
        
        // 页码指示器
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index + 1));
        });

        // 键盘控制
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // 触摸控制
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // 鼠标滚轮控制
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // 窗口resize事件
        window.addEventListener('resize', () => this.handleResize());
        
        // CTA按钮
        document.querySelector('.cta-button')?.addEventListener('click', () => {
            this.showNotification('感谢您的关注！', 'success');
        });
    }

    // 键盘事件处理
    handleKeydown(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // 空格键
                e.preventDefault();
                this.nextSlide();
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
        }
    }

    // 触摸事件处理
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        if (this.isTransitioning) return;
        
        this.touchEndX = e.changedTouches[0].screenX;
        const threshold = 50; // 最小滑动距离
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // 向左滑动 - 下一页
                this.nextSlide();
            } else {
                // 向右滑动 - 上一页
                this.prevSlide();
            }
        }
    }

    // 鼠标滚轮事件处理
    handleWheel(e) {
        if (this.isTransitioning) return;
        
        e.preventDefault();
        
        if (e.deltaY > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
    }

    // 窗口大小改变处理
    handleResize() {
        // 确保PPT容器保持正确的比例
        this.updateLayout();
    }

    // 上一页
    prevSlide() {
        if (this.currentSlide > 1 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    // 下一页
    nextSlide() {
        if (this.currentSlide < this.totalSlides && !this.isTransitioning) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    // 跳转到指定页面
    goToSlide(slideNumber) {
        if (slideNumber === this.currentSlide || this.isTransitioning) return;
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        this.isTransitioning = true;
        
        // 移除当前活动幻灯片的active类
        const currentSlideElement = document.querySelector('.slide.active');
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }

        // 添加新幻灯片的active类
        const newSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (newSlideElement) {
            newSlideElement.classList.add('active');
        }

        // 更新当前页面
        this.currentSlide = slideNumber;
        
        // 更新UI
        this.updateDots();
        this.updateButtons();
        
        // 触发页面切换动画
        this.triggerSlideAnimation(slideNumber);
        
        // 延迟重置过渡状态
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
        
        // 触发自定义事件
        this.dispatchSlideChangeEvent(slideNumber);
    }

    // 更新页码指示器
    updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            if (index + 1 === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // 更新导航按钮状态
    updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const leftNav = document.getElementById('leftNav');
        const rightNav = document.getElementById('rightNav');
        
        // 更新上一页按钮
        if (this.currentSlide === 1) {
            prevBtn?.setAttribute('disabled', 'true');
            leftNav?.setAttribute('disabled', 'true');
        } else {
            prevBtn?.removeAttribute('disabled');
            leftNav?.removeAttribute('disabled');
        }
        
        // 更新下一页按钮
        if (this.currentSlide === this.totalSlides) {
            nextBtn?.setAttribute('disabled', 'true');
            rightNav?.setAttribute('disabled', 'true');
        } else {
            nextBtn?.removeAttribute('disabled');
            rightNav?.removeAttribute('disabled');
        }
    }

    // 触发幻灯片动画
    triggerSlideAnimation(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (!slide) return;

        // 重置动画
        const animatedElements = slide.querySelectorAll('[class*="fade"], [class*="slide"]');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // 触发重排
            el.style.animation = null;
        });

        // 特殊页面的动画处理
        if (slideNumber === 5) {
            // 数据页面的进度条动画
            setTimeout(() => {
                const progressBars = slide.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }, 400);
        }
    }

    // 预加载动画
    preloadAnimations() {
        // 预加载进度条动画
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.style.transition = 'width 1s ease-in-out';
        });
    }

    // 更新布局
    updateLayout() {
        const container = document.querySelector('.ppt-container');
        if (!container) return;
        
        // 确保16:9比例
        const containerWidth = container.offsetWidth;
        const containerHeight = containerWidth * 9 / 16;
        
        if (containerHeight > window.innerHeight * 0.9) {
            container.style.height = window.innerHeight * 0.9 + 'px';
            container.style.width = (window.innerHeight * 0.9 * 16 / 9) + 'px';
        }
    }

    // 全屏相关
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            border-left: 4px solid ${this.getNotificationColor(type)};
            backdrop-filter: blur(20px);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            info: '#0071e3',
            success: '#34C759',
            warning: '#FF9500',
            error: '#FF3B30'
        };
        return colors[type] || colors.info;
    }

    // 派发幻灯片改变事件
    dispatchSlideChangeEvent(slideNumber) {
        const event = new CustomEvent('slideChange', {
            detail: {
                currentSlide: slideNumber,
                totalSlides: this.totalSlides
            }
        });
        document.dispatchEvent(event);
    }

    // 获取当前页面信息
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            isFirst: this.currentSlide === 1,
            isLast: this.currentSlide === this.totalSlides
        };
    }

    // 添加幻灯片
    addSlide(slideHTML, position = -1) {
        // 实现动态添加幻灯片的功能
        console.log('addSlide feature to be implemented');
    }

    // 移除幻灯片
    removeSlide(slideNumber) {
        // 实现移除幻灯片的功能
        console.log('removeSlide feature to be implemented');
    }

    // 自动播放
    startAutoPlay(interval = 5000) {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
        
        this.autoPlayTimer = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.goToSlide(1); // 循环播放
            }
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    // 销毁实例
    destroy() {
        this.stopAutoPlay();
        // 移除事件监听器
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('wheel', this.handleWheel);
        window.removeEventListener('resize', this.handleResize);
    }
}

// 初始化PPT
document.addEventListener('DOMContentLoaded', () => {
    // 创建PPT实例
    window.applePPT = new ApplePPT();
    
    // 监听幻灯片变化事件
    document.addEventListener('slideChange', (e) => {
        console.log(`幻灯片切换到第 ${e.detail.currentSlide} 页，共 ${e.detail.totalSlides} 页`);
    });
    
    // 添加全局快捷键提示
    let isShowingHelp = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !isShowingHelp) {
            showKeyboardHelp();
        }
    });
    
    function showKeyboardHelp() {
        isShowingHelp = true;
        const helpModal = document.createElement('div');
        helpModal.className = 'keyboard-help-modal';
        helpModal.innerHTML = `
            <div class="help-overlay" onclick="closeHelp()"></div>
            <div class="help-content">
                <h3>快捷键说明</h3>
                <div class="help-item">
                    <span class="help-key">← / ↑</span>
                    <span class="help-desc">上一页</span>
                </div>
                <div class="help-item">
                    <span class="help-key">→ / ↓ / 空格</span>
                    <span class="help-desc">下一页</span>
                </div>
                <div class="help-item">
                    <span class="help-key">Home</span>
                    <span class="help-desc">第一页</span>
                </div>
                <div class="help-item">
                    <span class="help-key">End</span>
                    <span class="help-desc">最后一页</span>
                </div>
                <div class="help-item">
                    <span class="help-key">Esc</span>
                    <span class="help-desc">退出全屏</span>
                </div>
                <div class="help-item">
                    <span class="help-key">?</span>
                    <span class="help-desc">显示帮助</span>
                </div>
                <button onclick="closeHelp()" class="help-close">关闭</button>
            </div>
        `;
        
        // 添加样式
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .help-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }
            .help-content {
                position: relative;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                color: white;
                backdrop-filter: blur(20px);
            }
            .help-content h3 {
                margin-bottom: 20px;
                text-align: center;
                color: #0071e3;
            }
            .help-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .help-key {
                background: rgba(255, 255, 255, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 14px;
            }
            .help-desc {
                color: #ccc;
            }
            .help-close {
                background: #0071e3;
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 16px;
                width: 100%;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(helpModal);
        
        window.closeHelp = () => {
            document.body.removeChild(helpModal);
            document.head.removeChild(style);
            isShowingHelp = false;
            delete window.closeHelp;
        };
    }
    
    // 性能监控
    if (window.performance && window.performance.mark) {
        window.performance.mark('ppt-init-complete');
    }
    
    console.log('🎨 苹果风格PPT初始化完成');
    console.log('💡 按 ? 键查看快捷键说明');
});

// 导出PPT类供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApplePPT;
}