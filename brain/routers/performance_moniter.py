from fastapi import APIRouter, Request
import psutil
import time
import asyncio
from datetime import datetime
from typing import Dict, Any
import threading

router = APIRouter()
class PerformanceMonitor:
    def __init__(self):
        self.start_time = time.time()
        self.request_count = 0
        self.ai_inference_times = []
        self.lock = threading.Lock()
    
    def get_system_metrics(self) -> Dict[str, Any]:
        # CPU and Memory
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Network statistics
        network = psutil.net_io_counters()
        # Process specific
        process = psutil.Process()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": time.time() - self.start_time,
            "system": {
                "cpu_percent": cpu_percent,
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "used_gb": round(memory.used / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "percent": memory.percent
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "used_gb": round(disk.used / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "percent": (disk.used / disk.total) * 100
                },
                "network": {
                    "bytes_sent": network.bytes_sent,
                    "bytes_recv": network.bytes_recv,
                    "packets_sent": network.packets_sent,
                    "packets_recv": network.packets_recv
                }
            },
            "process": {
                "memory_mb": round(process.memory_info().rss / (1024**2), 2),
                "cpu_percent": process.cpu_percent(),
                "threads": process.num_threads()
            },
            "application": {
                "total_requests": self.request_count,
                "avg_ai_inference_time": self.get_avg_inference_time()
            }
        }
    
    def record_request(self):
        with self.lock:
            self.request_count += 1
    
    def record_ai_inference(self, duration: float):
        with self.lock:
            self.ai_inference_times.append(duration)
            # Keep only last 100 measurements
            if len(self.ai_inference_times) > 100:
                self.ai_inference_times.pop(0)
    
    def get_avg_inference_time(self) -> float:
        with self.lock:
            if not self.ai_inference_times:
                return 0.0
            return round(sum(self.ai_inference_times) / len(self.ai_inference_times), 3)

# Global monitor instance
monitor = PerformanceMonitor()

@router.get("/health/performance")
async def get_performance_metrics():
    """Endpoint for your admin panel to poll"""
    return monitor.get_system_metrics()

@router.post("/ai/inference")
async def simulate_ai_inference():
    """Example AI endpoint with performance tracking"""
    start_time = time.time()
    
    # Simulate AI model inference (replace with your actual model call)
    await asyncio.sleep(2)  # Simulating 2-second inference
    
    inference_time = time.time() - start_time
    monitor.record_ai_inference(inference_time)
    
    return {
        "result": "AI inference completed",
        "inference_time_seconds": round(inference_time, 3)
    }

@router.get("/health/simple")
async def health_check():
    """Simple health check"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
