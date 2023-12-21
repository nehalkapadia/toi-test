'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [existingModule] = await queryInterface.sequelize.query(
      'SELECT * FROM "Modules" WHERE name = :name',
      {
        replacements: { name: 'Organizations' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (existingModule) {
      return;
    }
    // Insert module records
    await queryInterface.bulkInsert('Modules', [
      {
        name: 'Organizations',
        description: 'Description for Module 1',
        icon: 'fa-cogs',
        color: '#3498db',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Organization Users',
        description: 'Description for Module 2',
        icon: 'fa-users',
        color: '#27ae60',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more module records as needed
    ]);

    // Insert role records
    await queryInterface.bulkInsert('Roles', [
      {
        roleName: 'Admin',
        description: 'Administrator role with full access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: 'Member',
        description: 'Regular user role with limited access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more role records as needed
    ]);

    // Insert permission records
    await queryInterface.bulkInsert('Permissions', [
      {
        permissionName: 'Create',
        create: true,
        view: false,
        edit: false,
        delete: false,
        category: 'Users',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionName: 'View',
        create: false,
        view: true,
        edit: false,
        delete: false,
        category: 'Users',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionName: 'Edit',
        create: false,
        view: false,
        edit: true,
        delete: false,
        category: 'Users',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionName: 'Delete',
        create: false,
        view: false,
        edit: false,
        delete: true,
        category: 'Users',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more permission records as needed
    ]);

    // Insert role permission access records
    await queryInterface.bulkInsert('RolePermissionAccesses', [
      {
        name: 'Admin Access',
        permissionId: 1, // Replace with a valid permission ID
        roleId: 1, // Replace with a valid role ID
        moduleId: 1, // Replace with a valid module ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Member Access',
        permissionId: 2, // Replace with a valid permission ID
        roleId: 2, // Replace with a valid role ID
        moduleId: 2, // Replace with a valid module ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more role permission access records as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded module records
    await queryInterface.bulkDelete('Modules', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
