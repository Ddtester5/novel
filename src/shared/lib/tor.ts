import { exec } from "child_process";

const TOR_CONTAINER_NAME = "tor_proxy"; // Замените на имя вашего контейнера

const waitForContainerToBeHealthy = (
  containerName: string,
  timeout: number = 500000,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkContainerStatus = () => {
      exec(
        `docker inspect --format '{{.State.Health.Status}}' ${containerName}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(
              `Ошибка при проверке состояния контейнера: ${stderr}`,
            );
            return reject(error);
          }

          if (stdout.trim() === "healthy") {
            resolve();
          } else if (Date.now() - startTime > timeout) {
            reject(
              new Error(
                `Tor не стал здоровым в течение ${timeout / 1000} секунд`,
              ),
            );
          } else {
            // Проверяем статус контейнера через 1 секунду, если он еще не стал "healthy"
            setTimeout(checkContainerStatus, 1000);
          }
        },
      );
    };

    checkContainerStatus();
  });
};

export const restartTor = async (
  maxRetries = 2,
): Promise<void> => {
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    console.log(
      `⚙️ Попытка перезапуска Tor (${attempt}/${maxRetries})`,
    );

    try {
      await new Promise<void>((resolve, reject) => {
        exec(
          `docker restart ${TOR_CONTAINER_NAME}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(
                `Ошибка при перезапуске Tor: ${stderr}`,
              );
              return reject(error);
            }
            resolve();
          },
        );
      });

      console.log(
        "⏳ Ожидание, пока контейнер станет healthy...",
      );
      await waitForContainerToBeHealthy(TOR_CONTAINER_NAME);
      console.log("✅ Tor контейнер готов к использованию");
      return; // Успешно, выходим
    } catch (err) {
      console.warn(
        `⚠️ Попытка ${attempt} не удалась: ${err}`,
      );
      if (attempt >= maxRetries) {
        console.error(
          "❌ Все попытки перезапуска Tor не увенчались успехом",
        );
        throw err;
      }

      console.log("🔁 Повторная попытка перезапуска...");
    }
  }
};
