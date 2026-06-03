import java.util.concurrent.*;

public class ExecutorDemo {

    public static void main(String[] args)
            throws Exception {

        ExecutorService service =
            Executors.newFixedThreadPool(3);

        Callable<Integer> task1 =
            () -> 10;

        Callable<Integer> task2 =
            () -> 20;

        Future<Integer> f1 =
            service.submit(task1);

        Future<Integer> f2 =
            service.submit(task2);

        System.out.println(f1.get());
        System.out.println(f2.get());

        service.shutdown();
    }
}