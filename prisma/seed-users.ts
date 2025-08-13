import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de usuarios...");

  // Limpiar solo datos de usuarios y autenticación
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear usuarios
  console.log("👥 Creando usuarios...");
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@tienda.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Usuario Demo",
      email: "usuario@tienda.com",
      password: hashedPassword,
      role: "USER",
      isActive: true,
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      name: "Cliente Demo",
      email: "cliente@test.com",
      password: hashedPassword,
      role: "USER",
      isActive: true,
    },
  });

  console.log("✅ Seed de usuarios completado exitosamente!");
  console.log(`
📊 Datos creados:
- 👥 Usuarios: 3 (1 admin, 2 usuarios)

🔐 Credenciales de acceso:
Admin: admin@tienda.com / admin123
Usuario: usuario@tienda.com / admin123
Cliente: cliente@test.com / admin123
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
