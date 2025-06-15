bind            = "127.0.0.1:8000"
workers         = 2
worker_class    = "uvicorn.workers.UvicornWorker"
timeout         = 30
loglevel        = "info"
accesslog       = "/home/fastapi/Kursovaya/logs/access.log"
errorlog        = "/home/fastapi/Kursovaya/logs/error.log"