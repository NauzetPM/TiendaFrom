from rq import Worker
from rq.timeouts import BaseDeathPenalty


class WindowsDeathPenalty(BaseDeathPenalty):
    """Evita el uso de SIGALRM en Windows"""
    def __init__(self, timeout, *args, **kwargs):
        pass

    def __enter__(self):
        pass

    def __exit__(self, type, value, traceback):
        pass


class WindowsWorker(Worker):
    """Worker sin fork() y sin SIGALRM para Windows"""
    death_penalty_class = WindowsDeathPenalty

    def fork_work_horse(self, *args, **kwargs):
        """Evita que RQ intente hacer fork() en Windows"""
        raise NotImplementedError("fork() no está disponible en Windows.")

    def execute_job(self, *args, **kwargs):
        """Ejecuta los trabajos en el mismo proceso sin fork()"""
        return self.perform_job(*args, **kwargs)
