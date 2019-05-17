package com.marklogic.hub;

import com.marklogic.appdeployer.AppConfig;
import com.marklogic.appdeployer.DefaultAppConfigFactory;
import com.marklogic.appdeployer.command.modules.LoadModulesCommand;
import com.marklogic.appdeployer.impl.SimpleAppDeployer;
import com.marklogic.mgmt.util.SimplePropertySource;

import java.util.Properties;

/**
 * Because some tests clear out "user" modules, there's a chance that a test that depends on test modules -
 * marklogic-unit-test and modules under src/test/ml-modules - will have been deleted before a test runs that depends
 * on them. So any test that depends on them can use this class to ensure the test modules are loaded.
 */
public class LoadTestModules {

    public static void loadTestModules(String host, int finalPort, String username, String password, String modulesDatabaseName) {
        Properties props = new Properties();
        props.setProperty("mlUsername", username);
        props.setProperty("mlPassword", password);
        props.setProperty("mlHost", host);
        props.setProperty("mlRestPort", finalPort + "");

        AppConfig config = new DefaultAppConfigFactory(new SimplePropertySource(props)).newAppConfig();
        config.setModuleTimestampsPath(null);
        config.setModulesDatabaseName(modulesDatabaseName);

        /**
         * Adjust this to the possible paths that contain test modules (the path depends on how this test is run - e.g.
         * via an IDE or via Gradle). We don't need nor want to load from src/main/resources/ml-modules
         * because that will overwrite some collections and tokens set by the Installer program.
         */
        config.getModulePaths().clear();
        config.getModulePaths().add("marklogic-data-hub/build/mlRestApi/marklogic-unit-test-modules/ml-modules");
        config.getModulePaths().add("marklogic-data-hub/src/test/ml-modules");
        config.getModulePaths().add("build/mlRestApi/marklogic-unit-test-modules/ml-modules");
        config.getModulePaths().add("src/test/ml-modules");
        config.getModulePaths().add("../build/mlRestApi/marklogic-unit-test-modules/ml-modules");
        config.getModulePaths().add("../src/test/ml-modules");

        new SimpleAppDeployer(new LoadModulesCommand()).deploy(config);
    }
}
